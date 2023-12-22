const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { resolve } = require('path');

const { AddReminderInGroup } = require('../Middlewares/addremideringroupe.js');
const { UpdateReminder } = require('../Middlewares/updatereminder.js');
const { DeleteReminder } = require('../Middlewares/deletereminder.js');

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

// renvoi le reminder.js
function getAddReminderJS (req, res) {
    res.sendFile(resolve(__dirname, "../Middlewares/ajouterrappel.js"));
};


// met à jour le rappe l souhaité 
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
    addReminder,
    getAddReminderJS,
    updateReminder,
    getUpdateReminderJS,
    deleteReminder,
    getDeleteReminderJS,
};