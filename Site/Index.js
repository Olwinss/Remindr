const express = require('express');
const { resolve } = require ('path');
const { PrismaClient } = require('@prisma/client')

const app = express();
const prisma = new PrismaClient();
const port = 3010;

app.get("/", (req, res) => {
    res.sendFile(resolve(__dirname,"Template/login.html"))
})

app.get("/dashboard.html", (req, res) => {
    res.sendFile(resolve(__dirname,"Template/dashboard.html"))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

