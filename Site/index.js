const express = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const exphbs = require('express-handlebars').create({
    layoutsDir: resolve(__dirname, 'Template'), // Chemin des layouts à suivre
    defaultLayout: false, // Définissez à false pour désactiver les mises en page
    extname: '.hbs',
    /* autres options de configuration */
});


const { RegisterUser } = require('./Middlewares/register');
const { loginUser } = require('./Middlewares/login');
const { CreateGroup } = require('./Middlewares/creategroupe');
const { AddUserInGroup } = require('./Middlewares/adduseringroup');
const { AddReminderInGroup } = require('./Middlewares/addremideringroupe.js');
const { bodyParserMiddleware } = require('./Middlewares/bodyparser');

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

            const userGroups = user.Groupes_rejoints.map(group => group.nom);

            res.render('dashboard', { prenom, nom, email, userGroups });
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
        const reminders = await prisma.rappels.findMany({
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

        const Formated_rmdr = formaterRappels(reminders);
        res.render('groupe', { groupName, reminders: Formated_rmdr });
    } catch (error) {
        console.error('Erreur lors de la récupération des rappels :', error);
        res.status(500).send('Erreur serveur');
    }
});

function formaterRappels(rappels) {
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };

    return rappels.map(rappel => {
        const date = new Date(rappel.date).toLocaleDateString('fr-FR', optionsDate);
        const time = new Date(rappel.time).toLocaleTimeString('fr-FR', optionsTime);

        return {
            ...rappel,
            date: date,
            time: time
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

// Listening port 

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
