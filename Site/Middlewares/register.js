const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

// Création du compte du nouvel utilisateur
async function RegisterUser(req, res) {
    try {
        const new_firstname = req.body.new_firstname;
        const new_surname = req.body.new_surname;
        const new_email = req.body.new_email;
        const new_pswd = req.body.new_password;

        if (new_email && new_pswd && new_surname && new_firstname) {
            // On hache le nouveau mot de passe
            const hashedPassword = await bcrypt.hash(new_pswd, 10);

            // On créé l'utilisateur dans la base de données
            const utilisateur = await prisma.utilisateurs.create({
                data: {
                    email: new_email,
                    prenom: new_firstname,
                    nom: new_surname,
                    password: hashedPassword,
                },
            });

            return utilisateur;
        } else {
            throw new Error('Veuillez remplir tous les champs du formulaire.');
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { RegisterUser };