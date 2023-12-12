const express = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client')

const { RegisterUser } = require('./Middlewares/register');
const { loginUser } = require('./Middlewares/login');
const { bodyParserMiddleware } = require('./Middlewares/middleware');

const app = express();
const prisma = new PrismaClient();
const port = 3010;

app.use(express.static('static'));

app.get("/", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/login.html"));
});

app.get("/login.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/login.html"));
 
});

app.get("/styles.css", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/styles.css"));
});

app.post("/register", bodyParserMiddleware, (req, res) => {
    RegisterUser(req, res);
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
});

app.get("/register.js",(req,res) =>
{
    res.sendFile(resolve(__dirname,"register.js"));
 
app.get("/inscription.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/inscription.html"));
});

app.get("/dashboard.html", (req, res) => {
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
});

app.post("/login", bodyParserMiddleware, (req, res) => {
    loginUser(req, res);
    res.sendFile(resolve(__dirname, "Template/dashboard.html"));
});

app.get("/login.js", (req, res) => {
    res.sendFile(resolve(__dirname, "login.js"));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
