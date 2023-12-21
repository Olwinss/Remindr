const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { resolve } = require('path');
const prisma = new PrismaClient();
const { loginUser, registerUser: RegisterUser } = require('../Services/authService'); // Assurez-vous d'importer le bon service

async function loginUserController(req, res) {
    try {
        const user = await loginUser(req.body.email, req.body.password);
        req.session.user = user;
        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        if (error === 1) {
            // Dire que le mot de passe ou l'email est incorrect
        } else if (error === 2) {
            // Dire que tous les champs doivent être remplis
        }
        res.sendFile(resolve(__dirname, "Template/login.html"));
    }
}

function getLoginPage(req, res) {
    res.sendFile(resolve(__dirname, "Template/login.html"));
}

async function registerUserController(req, res) {
    try {
        const user = await RegisterUser(req.body.new_email, req.body.new_password);
        req.session.user = user;
        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        if (error === 1) {
            // Dire que l'email est déjà utilisé
        } else if (error === 2) {
            // Dire que tous les champs doivent être remplis
        }
        res.sendFile(resolve(__dirname, "Template/register.html"));
    }
}

function getRegisterPage(req, res) {
    res.sendFile(resolve(__dirname, "Template/register.html"));
}

function logoutUser(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error("Erreur lors de la déconnexion :", err);
        } else {
            res.redirect("/login.html");
        }
    });
}

module.exports = {
    loginUserController,
    getLoginPage,
    registerUserController,
    getRegisterPage,
    logoutUser,
};
