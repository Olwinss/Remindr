const express = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client')
const cookieParser = require("cookie-parser");
const session = require('express-session');

const { RegisterUser } = require('./Middlewares/register');
const { loginUser } = require('./Middlewares/login');
const { CreateGroup } = require('./Middlewares/creategroupe');
const { AddUserInGroup } = require('./Middlewares/adduseringroup');
const { bodyParserMiddleware } = require('./Middlewares/bodyparser');

const app = express();
const prisma = new PrismaClient();
const port = 3010;

app.use(express.static('public'));

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
        const dashboardHTML = `
            <!-- Votre code HTML personnalisé pour le tableau de bord -->
            <h1>Bienvenue ${prenom} ${nom} (${email}) sur le tableau de bord!</h1>
            <!-- Autres éléments du tableau de bord -->
        `;
        res.send(dashboardHTML);
    } else {
        // Redirigez vers la page de connexion si l'utilisateur n'est pas connecté
        res.redirect("/login.html");
    }
});

// Login
app.post("/login", bodyParserMiddleware, (req, res) => {
    loginUser(req, res)
        .then((user) => {
            // Stockez les informations de l'utilisateur dans la session
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
            // Stockez les informations de l'utilisateur dans la session
            req.session.user = user;
            res.sendFile(resolve(__dirname, "Template/dashboard.html"));
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
    CreateGroup(req, res)
    .then(() =>res.sendFile(resolve(__dirname, "Template/dashboard.html")))
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
    
});


// Dashboard 

app.get("/dashboard.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
});

// Groupes

app.get('/groupe/:groupName', (req, res) => { // Affichage
    const groupName = req.params.groupName;

    // Créer une fonction générant le code html pour ce groupe
    const html = groupName; // mettre le code html ici à la place de groupName
    res.send(html);

});

app.post("/groupe/:groupName/adduseringroupe", bodyParserMiddleware,(req, res) => { // Ajout d'un user
    AddUserInGroup(req, res,req.params.groupName)
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
