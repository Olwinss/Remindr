const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function RegisterUser(req,res) {
    const new_firstname = req.body.new_firstname
    const new_surname = req.body.new_surname
    const new_email = req.body.new_email;
    const new_pswd = req.body.new_password;
    if (new_email && new_pswd && new_surname && new_firstname) {
        utilisateurs = {
            email: new_email,
            prenom: new_firstname,
            nom: new_surname,
            password: new_pswd,
        }
        try {
            const createUser = await prisma.utilisateurs.create({ data: utilisateurs })
            console.log('Utilisateur créé avec succès:');
        }
        catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur :', error);
        }
    }
    else
    { 
        console.error('Veuillez remplir tous les champs du formulaire.');

        return false; // Pour empêcher la soumission du formulaire
    }
}

module.exports = { RegisterUser };