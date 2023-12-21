const express = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars').create({
    layoutsDir: resolve(__dirname, 'Template'), // Chemin des layouts à suivre
    defaultLayout: false,
    extname: '.hbs',
});

const { RegisterUser } = require('./Middlewares/register');
const { loginUser } = require('./Middlewares/login');
const { CreateGroup } = require('./Middlewares/creategroupe');
const { AddUserInGroup } = require('./Middlewares/adduseringroup');
const { AddReminderInGroup } = require('./Middlewares/addremideringroupe.js');
const { bodyParserMiddleware } = require('./Middlewares/bodyparser');
const { UpdateReminder } = require('./Middlewares/updatereminder.js');
const { DeleteReminder } = require('./Middlewares/deletereminder.js');

const app = express();
const prisma = new PrismaClient();
const port = 3010;

app.set('views', resolve(__dirname, 'Template'));

app.engine('.hbs', exphbs.engine);
app.set('view engine', '.hbs');

// Styles 

app.use(express.static('public'));

// Sessions
app.use(cookieParser());
app.use(session({
    secret: 'votre_secret_key',
    resave: false,
    saveUninitialized: true,
}));

// Racine du site

app.get("/", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/login.html"));
});

// Dashboard
// Dans votre route /dashboard
app.get("/dashboard", async (req, res) => {
    if (req.session.user) {
        const { prenom, nom, email } = req.session.user;

        try {
            // Obtenez les groupes de l'utilisateur depuis la base de données avec Prisma
            const user = await prisma.utilisateurs.findUnique({
                where: { email },
                include: {
                    Groupes_rejoints: {
                        select: { nom: true } // Sélectionnez uniquement le nom du groupe
                    }
                }
            });

            if (!user) {
                console.error("Utilisateur non trouvé :", email);
                res.status(404).send('Utilisateur non trouvé');
                return;
            }

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set the time to the beginning of the current day

            const allReminders = await prisma.utilisateurs.findMany({
                where: { email },
                include: {
                    Groupes_rejoints: {
                        select: {
                            Rappel: {
                                where: {
                                    AND: [
                                        {
                                            date: {
                                                gt: currentDate // Rappels avec date supérieure à l'heure actuelle
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            });

            const userGroups = user.Groupes_rejoints.map(group => group.nom);

            const Formated_reminders = allReminders[0].Groupes_rejoints.flatMap(group => group.Rappel);
            Formated_reminders.sort((a, b) => {
                const dateA = new Date(`${a.date} ${a.time}`);
                const dateB = new Date(`${b.date} ${b.time}`);
                return dateA - dateB;
            });
            console.log(Formated_reminders);
            res.render('dashboard', { prenom, nom, email, userGroups, allreminders: Formated_reminders });
        } catch (error) {
            console.error("Erreur lors de la récupération des groupes de l'utilisateur :", error);
            res.status(500).send('Erreur serveur');
        }
    } else {
        res.redirect("/login.html");
    }
});




// Login
app.post("/login", bodyParserMiddleware, (req, res) => {
    loginUser(req, res)
        .then((user) => {
            // On stocke les infos de l'utilisateur connecté
            req.session.user = user;
            res.redirect("/dashboard");


        })
        .catch((error) => {
            console.log(error);
            if (error == 1) {
                // dire que mdp ou email incorrect
            } else if (error == 2) {
                // dire que faut tt remplir
            }
            res.sendFile(resolve(__dirname, "Template/login.html"));
        });
});


app.get("/login.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/login.html"));

});

// Register
app.post("/register", bodyParserMiddleware, (req, res) => {
    RegisterUser(req, res)
        .then((user) => {
            // On stocke les infos de l'utilisateur connecté
            req.session.user = user;
            res.redirect("/dashboard");
        })
        .catch((error) => {
            console.log(error);
            if (error == 1) {
                // dire que email déjà utilisé
            } else if (error == 2) {
                // dire que faut tt remplir
            }
            res.sendFile(resolve(__dirname, "Template/register.html"));
        });
});

app.get("/register.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/register.html"));

});

// Déconnexion
app.get("/logout", (req, res) => {
    // Détruire la session
    req.session.destroy((err) => {
        if (err) {
            console.error("Erreur lors de la déconnexion :", err);
        } else {
            // Rediriger vers la page de connexion après la déconnexion
            res.redirect("/login.html");
        }
    });
});

//Groupes 

app.post("/creategroupe", bodyParserMiddleware, (req, res) => {
    // Vérifiez si l'utilisateur est connecté en vérifiant la session
    if (req.session.user) {
        const { prenom, nom, email } = req.session.user;
        CreateGroup(req, res)
            .then(() => {
                // Après la création réussie, rechargez simplement la page
                res.redirect("/dashboard");
            })
            .catch((error) => {
                if (error == 1) {
                    res.render('dashboard', { prenom, nom, email }); // dire que nom de groupe déjà utilisé 
                } else if (error == 2) {
                    res.render('dashboard', { prenom, nom, email }); // dire que impossible de récupérer le nom du groupe
                }
            });
    } else {
        // Redirigez vers la page de connexion si l'utilisateur n'est pas connecté
        res.redirect("/login.html");
    }
});


// Groupes

app.get('/groupe/:groupName', async (req, res) => {
    try {
        const groupName = req.params.groupName;

        // Vérifiez si l'utilisateur appartient au groupe
        const user = await prisma.utilisateurs.findUnique({
            where: { email: req.session.user.email },
            include: {
                Groupes_rejoints: {
                    where: { nom: groupName }, // Filtrez le groupe spécifique
                    select: { nom: true }
                }
            }
        });

        if (!user || user.Groupes_rejoints.length === 0) {
            // L'utilisateur n'appartient pas au groupe, rediriger ou envoyer une erreur
            return res.status(403).send('Accès interdit');
        }

        // L'utilisateur appartient au groupe, continuez avec la logique existante pour récupérer les rappels, etc.
        const Formated_reminders = await prisma.rappels.findMany({
            where: { nom_groupe: groupName },
            orderBy: [
                {
                    date: 'asc',
                },
                {
                    time: 'asc',
                },
            ],
        });

        const Formated_rmdr = formaterRappels(Formated_reminders, req.session.user.email);
        res.render('groupe', { groupName, reminders: Formated_rmdr });
    } catch (error) {
        console.error('Erreur lors de la récupération des rappels :', error);
        res.status(500).send('Erreur serveur');
    }
});

function formaterRappels(rappels, user_email) {
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };

    return rappels.map(rappel => {
        const date = new Date(rappel.date).toLocaleDateString('fr-FR', optionsDate);
        const time = new Date(rappel.time).toLocaleTimeString('fr-FR', optionsTime);

        return {
            ...rappel,
            date: date,
            time: time,
            user_email: user_email,
        };
    });
}

app.post("/adduseringroupe", bodyParserMiddleware, (req, res) => { // Ajout d'un user
    const groupName = req.body.groupe;
    AddUserInGroup(req, res)
        .then(() => {
            res.redirect("/groupe/" + groupName);
        }) // renvoyer sur la page du groupe actuel 
        .catch((error) => {
            if (error == 1) {
                res.redirect("/groupe/" + groupName);
                // groupe non trouvé 
            }
            else if (error == 2) {
                res.redirect("/groupe/" + groupName);
                // Déjà dans le groupe 
            }
            else if (error == 3) {
                res.redirect("/groupe/" + groupName);
                // Email ou groupe invalide
            }
        })
});

app.get("/adduseringroupe.js", (req, res) => {
    res.sendFile(resolve(__dirname, "adduseringroupe.js"));
});

// Rappels 
app.post("/ajouterrappel", bodyParserMiddleware, (req, res) => { // Ajout d'un user
    const groupName = req.body.groupe;
    AddReminderInGroup(req, res)
        .then(() => res.redirect("/groupe/" + groupName)) // renvoyer sur la page du groupe actuel 
        .catch((error) => {
            if (error == 1) {
                // dire que nom de groupe déjà utilisé 
            }
            else if (error == 2) {
                // dire que impossible de récupérer le nom du groupe
            }
        })
});

app.get("/ajouterrappel.js", (req, res) => {
    res.sendFile(resolve(__dirname, "ajouterrappel.js"));
});



app.post("/updatereminder", bodyParserMiddleware, (req, res) => {
    const groupName = req.body.groupe;
    UpdateReminder(req, res)
        .then(() => res.redirect("/groupe/" + groupName)) // renvoyer sur la page du groupe actuel 
        .catch((error) => {
            res.redirect("/groupe/" + groupName);
            if (error == 1) {
                // dire que nom de groupe déjà utilisé 
            }
            else if (error == 2) {
                // dire que impossible de récupérer le nom du groupe
            }
        })
})

app.get("/updatereminder.js", (req, res) => {
    res.sendFile(resolve(__dirname, "updatereminder.js"));
});

// 

app.post("/deletereminder", bodyParserMiddleware, (req, res) => {
    const groupName = req.body.groupe;
    DeleteReminder(req, res)
        .then(() => res.redirect("/groupe/" + groupName)) // renvoyer sur la page du groupe actuel 
        .catch((error) => {
            res.redirect("/groupe/" + groupName);
            if (error == 1) {
                // dire que nom de groupe déjà utilisé 
            }
            else if (error == 2) {
                // dire que impossible de récupérer le nom du groupe
            }
        })
})

app.get("/deletereminder.js", (req, res) => {
    res.sendFile(resolve(__dirname, "deletereminder.js"));
});

// handlebars Helpers 

handlebars.registerHelper('isCreator', function (reminderCreatorEmail, user_email) {
    return user_email == reminderCreatorEmail;
});

handlebars.registerHelper('GetStyle', function (dateEcheance, heureEcheance, couleur) {
    // Récupération de la date actuelle
    var currentDate = new Date();

    // Parsing des valeurs de date et d'heure
    const [day, month, year] = dateEcheance.split("/");
    const [hours, minutes] = heureEcheance.split(":");

    // Création de l'objet dateTime
    const dateTime = new Date(`${year}-${month}-${day}T${hours-1}:${minutes}:00`);

    if (currentDate > dateTime) {
        // Date dépassée
        return "background-color: " + couleur + "; border: 4px solid #000000; font-weight: bold; border-style: dotted; color: " + (isColorDark(couleur) ? "white" : "black") + ";";
    } 
    else {
        // Calcul de la différence de temps en heures
        var timeDifference = dateTime - currentDate;
        var hoursDifference = timeDifference / (1000 * 60 * 60);
        
        if ((hoursDifference - 1) <= 24) {
            // Date à venir dans les prochaines 24 heures
            return "background-color: " + couleur + "; border: 4px solid #000000; font-style: italic; border-style: dotted dashed solid double; color: " + (isColorDark(couleur) ? "white" : "black") + ";";
        } 
        else {
            // Date à venir dans plus de 24 heures
            return "background-color: " + couleur + "; border: 4px solid #000000; border-style: solid; color: " + (isColorDark(couleur) ? "white" : "black") + ";";
        }
    }
});

// Fonction pour vérifier si une couleur est foncée
function isColorDark(color) {
    // Vous pouvez utiliser une logique plus avancée ici pour déterminer si la couleur est foncée ou claire
    // Cette implémentation simple suppose que la couleur est foncée si la luminosité moyenne est inférieure à 128
    const rgb = parseInt(color.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness < 128;
}

// Listening port 

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});


