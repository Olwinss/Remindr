const express = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client')

const { RegisterUser } = require('./Middlewares/register');
const { loginUser } = require('./Middlewares/login');
const { CreateGroup } = require('./Middlewares/creategroupe');
const { AddUserInGroup } = require('./Middlewares/adduseringroup');
const { AddReminderInGroup } = require('./Middlewares/addremideringroupe.js');
const { bodyParserMiddleware } = require('./Middlewares/bodyparser');

const app = express();
const prisma = new PrismaClient();
const port = 3010;

app.use(express.static('public'));

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
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
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

// Rappels 
app.post("/ajouterrappel", bodyParserMiddleware,(req, res) => { // Ajout d'un user
    AddReminderInGroup(req, res)
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

app.get("/ajouterrappel.js",(req,res) =>
{
    res.sendFile(resolve(__dirname,"ajouterrappel.js"));
});

// Listening port 

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
