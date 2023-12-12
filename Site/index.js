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
    loginUser(req, res);
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
});


app.get("/login.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/login.html"));
 
});

// Register 

app.post("/register", bodyParserMiddleware, (req, res) => {
    RegisterUser(req, res);
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
});

app.get("/inscription.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/inscription.html"));
 
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

app.get("/groupe", bodyParserMiddleware,(req, res) => {
    res.sendFile(resolve(__dirname, "Template/groupe.html"));
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
