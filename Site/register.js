const express = require('express');

const { PrismaClient } = require('@prisma/client')

const app = express();
const prisma = new PrismaClient();

async function RegisterUser() {
    var new_firstname = document.registration.new_firstname
    var new_surname = document.registration.new_surname
    var new_email = document.registration.new_email; 
    var new_pswd = document.registration.new_password;
    if (new_email && new_psw && new_surname && new_firstname)
    {
        utilisateurs = {
            email: new_email,
            prenom: new_firstname,
            nom: new_surname, 
            password: new_pswd,
        }
        try
        {
            const createUser = await prisma.utilisateurs.create({ data: utilisateurs })
            console.log('Utilisateur créé avec succès:', createUser);
        }
        catch (error)
        {
            console.error('Erreur lors de la création de l\'utilisateur :', error);
        }
    }
    else
        console.error('Veuillez remplir tous les champs du formulaire.');

    return false; // Pour empêcher la soumission du formulaire
}