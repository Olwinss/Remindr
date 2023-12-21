const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { resolve } = require('path');

const { AddReminderInGroup } = require('../Middlewares/addremideringroupe.js');
const { UpdateReminder } = require('../Middlewares/updatereminder.js');
const { DeleteReminder } = require('../Middlewares/deletereminder.js');

function formaterRappels(rappels,user_email) {
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };

    return rappels.map(rappel => {
        const date = new Date(rappel.date).toLocaleDateString('fr-FR', optionsDate);
        const time = new Date(rappel.time).toLocaleTimeString('fr-FR', optionsTime);

        return {
            ...rappel,
            date: date,
            time: time,
            user_email: user_email,
        };
    });
}


// Rappels 
function addReminder (req, res) { // Ajout d'un user
    const groupName = req.body.groupe;
    AddReminderInGroup(req, res)
        .then(() => res.redirect("/groupe/" + groupName)) // renvoyer sur la page du groupe actuel 
        .catch((error) => {
            if (error == 1) {
                // dire que nom de groupe déjà utilisé 
            }
            else if (error == 2) {
                // dire que impossible de récupérer le nom du groupe
            }
        })
};

function getAddReminderJS (req, res) {
    res.sendFile(resolve(__dirname, "../Middlewares/ajouterrappel.js"));
};



function updateReminder (req,res) {
    const groupName = req.body.groupe;
    
    UpdateReminder(req, res)
        .then(() => res.redirect("/groupe/" + groupName)) // renvoyer sur la page du groupe actuel 
        .catch((error) => 
        {
            res.redirect("/groupe/" + groupName);
            if (error == 1) {
                // dire que nom de groupe déjà utilisé 
            }
            else if (error == 2) {
                // dire que impossible de récupérer le nom du groupe
            }
        })
};

function getUpdateReminderJS (req, res){
    res.sendFile(resolve(__dirname, "../Middlewares/updatereminder.js"));
};

// 

function deleteReminder (req,res) {
    const groupName = req.body.groupe;
    DeleteReminder(req, res)
        .then(() => res.redirect("/groupe/" + groupName)) // On renvoie sur la page du groupe actuel 
        .catch((error) => 
        {
            res.redirect("/groupe/" + groupName);
            if (error == 1) {
                // dire que nom de groupe déjà utilisé 
            }
            else if (error == 2) {
                // dire que impossible de récupérer le nom du groupe
            }
        })
};

function getDeleteReminderJS (req, res) {
    res.sendFile(resolve(__dirname, "../Middlewares/deletereminder.js"));
};

module.exports = {
    formaterRappels,
    addReminder,
    getAddReminderJS,
    updateReminder,
    getUpdateReminderJS,
    deleteReminder,
    getDeleteReminderJS,
};