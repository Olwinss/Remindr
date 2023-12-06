const express = require('express');
const { PrismaClient } = require('@prisma/client')

const app = express();
const prisma = new PrismaClient();
const port = 3010;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});