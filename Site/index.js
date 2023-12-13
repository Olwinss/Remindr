const express = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const exphbs = require('express-handlebars').create({
    layoutsDir: resolve(__dirname, 'Template/layouts'), // Chemin des layouts à suivre
    defaultLayout: 'dashboard', // Définissez à false pour désactiver les mises en page
    extname: '.hbs',
    /* autres options de configuration */
  });


const { RegisterUser } = require('./Middlewares/register');
const { loginUser } = require('./Middlewares/login');
const { CreateGroup } = require('./Middlewares/creategroupe');
const { AddUserInGroup } = require('./Middlewares/adduseringroup');
const { bodyParserMiddleware } = require('./Middlewares/bodyparser');

const app = express();
const prisma = new PrismaClient();
const port = 3010;

app.use(express.static('public'));

app.set('views', resolve(__dirname, 'Template'));

app.engine('.hbs', exphbs.engine);
app.set('view engine', '.hbs');


// Utilisez cookie-parser et express-session middleware
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

// Styles 

app.get("/styles.css", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/styles.css"));
});

// Dashboard
app.get("/dashboard", (req, res) => {
    // Vérifiez si l'utilisateur est connecté en vérifiant la session
    if (req.session.user) {
        // Utilisez les informations de la session pour personnaliser le tableau de bord
        const { prenom, nom, email } = req.session.user;
        res.render('dashboard', { prenom, nom, email });  // On utilise le template handblebars avec les variables récupérées de la session
    } else {
        // Redirigez vers la page de connexion si l'utilisateur n'est pas connecté
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
 

//Groupes 

app.post("/creategroupe", bodyParserMiddleware,(req, res) => {
    // Vérifiez si l'utilisateur est connecté en vérifiant la session
    console.log("ici")
    if (req.session.user) {
        CreateGroup(req, res)
        .then(() => res.redirect("/dashboard"))
        .catch((error) => {
            console.log(error);
            if (error==1)
            {
                // dire que nom de groupe déjà utilisé 
            }
            else if (error==2)
            {
                // dire que impossible de récupérer le nom du groupe
            }
        })
    } else {
        // Redirigez vers la page de connexion si l'utilisateur n'est pas connecté
        res.redirect("/login.html");
    }

    
});


// // Dashboard 

// app.get("/dashboard.html", (req, res) => {
//     res.sendFile(resolve(__dirname, "Template/layouts/dashboard.html"));
// });

// Groupes

app.get('/groupe/:groupName', (req, res) => { // Affichage
    const groupName = req.params.groupName;
    // Créer une fonction générant le code html pour ce groupe
    res.sendFile(resolve(__dirname, "Template/groupe.html"))
});

app.post("/adduseringroupe", bodyParserMiddleware,(req, res) => { // Ajout d'un user
    AddUserInGroup(req, res)
    .then(() => res.sendFile(resolve(__dirname, "Template/groupe.html"))) // renvoyer sur la page du groupe actuel 
    .catch((error) => {
        if (error==1)
        {
            // dire que nom de groupe déjà utilisé 
        }
        else if (error==2)
        {
            // dire que impossible de récupérer le nom du groupe
        }
    })
});

app.get("/adduseringroupe.js",(req,res) =>
{
    res.sendFile(resolve(__dirname,"adduseringroupe.js"));
});


// Listening port 

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
