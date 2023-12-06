const express = require('express');
const { resolve } = require('path');

const { PrismaClient } = require('@prisma/client')

const app = express();
const prisma = new PrismaClient();
const port = 3010;

app.use(express.static('static'));

app.get("/",(req,res) =>
{
    res.sendFile(resolve(__dirname,"Template/inscription.html"));
});

app.get("/register.js",(req,res) =>
{
    res.sendFile(resolve(__dirname,"register.js"));
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

