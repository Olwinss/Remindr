const express = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client')

const { RegisterUser } = require('./Middlewares/register');
const { loginUser } = require('./Middlewares/login');
const { CreateGroup } = require('./Middlewares/creategroupe');

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

app.get("/login.js", (req, res) => {
    res.sendFile(resolve(__dirname, "login.js"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/login.html"));
 
});

// Register 

app.post("/register", bodyParserMiddleware, (req, res) => {
    RegisterUser(req, res);
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
});

app.get("/register.js",(req,res) =>
{
    res.sendFile(resolve(__dirname,"register.js"));
});

app.get("/inscription.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/inscription.html"));
 
});
 

//Groupes 

app.post("/creategroupe", bodyParserMiddleware,(req, res) => {
    CreateGroup(req, res);
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
});

app.get("/creategroup.js",(req,res) =>
{
    res.sendFile(resolve(__dirname,"creategroup.js"));
});

// Dashboard 

app.get("/dashboard.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
});

// affichage groupes

app.get("/groupe", bodyParserMiddleware,(req, res) => {
    res.sendFile(resolve(__dirname, "Template/groupe.html"));
});


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
