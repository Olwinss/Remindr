const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { resolve } = require('path');
const prisma = new PrismaClient();

const { RegisterUser } = require('../Middlewares/register');
const { loginUser } = require('../Middlewares/login');

async function loginUserController(req, res) {
    loginUser(req, res)
        .then((user) => {
            // On stocke les infos de l'utilisateur connecté
            req.session.user = user;
            res.redirect("/dashboard");
        })
        .catch((error) => {
            console.log(error);
            if (error == 1) {
                // dire que mdp ou email incorrect
            } else if (error == 2) {
                // dire que faut tt remplir
            }
            res.sendFile(resolve(__dirname, "../Template/login.html"));
        });
};

function getLoginPage(req, res) {
    res.sendFile(resolve(__dirname, "../Template/login.html"));
}

async function registerUserController(req, res) {
    RegisterUser(req, res)
        .then((user) => {
            // On stocke les infos de l'utilisateur connecté
            req.session.user = user;
            res.redirect("/dashboard");
        })
        .catch((error) => {
            console.log(error);
            if (error == 1) {
                // dire que email déjà utilisé
            } else if (error == 2) {
                // dire que faut tt remplir
            }
            res.sendFile(resolve(__dirname, "../Template/register.html"));
        });
};

function getRegisterPage(req, res) {
    res.sendFile(resolve(__dirname, "../Template/register.html"));
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
