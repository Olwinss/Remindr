const { resolve } = require('path'); 

const { RegisterUser } = require('../Middlewares/register');
const { loginUser } = require('../Middlewares/login');



// fonction pour essayer de log l'utilisateur
async function loginUserController(req, res) {
    loginUser(req, res)
        .then((user) => {
            // On stocke les infos de l'utilisateur connecté
            req.session.user = user; 
            res.redirect("/dashboard"); // on le renvoi sur dashboard 
        })
        .catch((error) => {
            console.log(error);
            if (error == 1) {
                console.err("mdp ou email incorrect")
            } else if (error == 2) {
                console.err("Tout n'est pas rempli")
            }
            res.sendFile(resolve(__dirname, "../Templates/login.html"));
        });
};

// Renvoi la page login 
function getLoginPage(req, res) {
    res.sendFile(resolve(__dirname, "../Templates/login.html"));
}


// fonction pour essayer de register l'utilisateur
async function registerUserController(req, res) {
    RegisterUser(req, res)
        .then((user) => {
            // On stocke les infos de l'utilisateur connecté
            req.session.user = user;
            res.redirect("/dashboard"); // on le renvoi sur dashboard
        })
        .catch((error) => {
            console.log(error);
            if (error == 1) {
                console.err("email déjà utilisé")
            } else if (error == 2) {
                console.err("Tous les champs ne sont pas remplis")
            }
            res.sendFile(resolve(__dirname, "../Templates/register.html")); // nous remet sur la page pour s'inscrire en cas d'erreur 
        });
};

// Renvoi la page register 
function getRegisterPage(req, res) {
    res.sendFile(resolve(__dirname, "../Templates/register.html"));
}

// permet de déconnecter l'utilisateur et de détruire sa session 
function logoutUser(req, res) {
    req.session.destroy((err) => { // enlève les cookies 
        if (err) {
            console.error("Erreur lors de la déconnexion :", err);
        } else {
            res.redirect("/login.html");
        }
    });
}

// Permet d'utiliser ces fonctions autre part 
module.exports = {
    loginUserController,
    getLoginPage,
    registerUserController,
    getRegisterPage,
    logoutUser,
};
