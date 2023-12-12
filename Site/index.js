const express = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client')

const { RegisterUser } = require('./Middlewares/register');
const { loginUser } = require('./Middlewares/login');
const { CreateGroup } = require('./Middlewares/creategroupe');
const { AddUserInGroup } = require('./Middlewares/adduseringroup');
const { bodyParserMiddleware } = require('./Middlewares/bodyparser');

const app = express();
const prisma = new PrismaClient();
const port = 3010;

app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/login.html"));
});

// Styles 

app.get("/styles.css", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/styles.css"));
});

// Login

app.post("/login", bodyParserMiddleware, (req, res) => {
    loginUser(req, res)
    .then(()=>res.sendFile(resolve(__dirname, "Template/dashboard.html")))
    .catch((error) => { 
        console.log(error);
        if (error==1)
        {
            // dire que mdp ou email incorrect
        }
        else if (error==2)
        {
            // dire que faut tt remplir 
        }
        res.sendFile(resolve(__dirname, "Template/login.html")) // + afficher un message d'erreur
    });
});


app.get("/login.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/login.html"));
 
});

// Register 

app.post("/register", bodyParserMiddleware, (req, res) => {
    RegisterUser(req, res)
    .then(()=> res.sendFile(resolve(__dirname, "Template/dashboard.html")))
    .catch((error) => {
        console.log(error);
        if (error==1)
        {
            // dire que email deja utiliser
        }
        else if (error==2)
        {
            // dire que faut tt remplir 
        }
        res.sendFile(resolve(__dirname, "Template/register.html")) // + afficher un message d'erreur
    })
});

app.get("/register.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/register.html"));
 
});
 

//Groupes 

app.post("/creategroupe", bodyParserMiddleware,(req, res) => {
    CreateGroup(req, res);
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
});


// Dashboard 

app.get("/dashboard.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
});

// affichage groupes

app.get('/groupe/:groupName', (req, res) => {
    const groupName = req.params.groupName;
    // Créer une fonction générant le code html pour ce groupe
    const html = groupName; // mettre le code html ici
    res.send(html);
    //res.send(`Vous avez cliqué sur le groupe : ${groupName}`);
});
// Ajout dans groupes 

app.post("/adduseringroupe", bodyParserMiddleware,(req, res) => {
    AddUserInGroup(req, res);
    // renvoyer sur la page du groupe actuel 
    res.sendFile(resolve(__dirname, "Template/groupe.html"));
});

app.get("/adduseringroupe.js",(req,res) =>
{
    res.sendFile(resolve(__dirname,"adduseringroupe.js"));
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
