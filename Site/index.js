const express = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client')

const { RegisterUser } = require('./Middlewares/register');
const { bodyParserMiddleware } = require('./Middlewares/middleware');

const app = express();
const prisma = new PrismaClient();
const port = 3010;

app.use(express.static('static'));

app.get("/",(req,res) =>
{
    res.sendFile(resolve(__dirname,"Template/inscription.html"));
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
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

