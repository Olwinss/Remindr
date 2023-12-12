const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function RegisterUser(req, res) {
    return new Promise((resolve, reject) => {
        const new_firstname = req.body.new_firstname;
        const new_surname = req.body.new_surname;
        const new_email = req.body.new_email;
        const new_pswd = req.body.new_password;

        if (new_email && new_pswd && new_surname && new_firstname) {
            const utilisateurs = {
                email: new_email,
                prenom: new_firstname,
                nom: new_surname,
                password: new_pswd,
            };

            prisma.utilisateurs
                .create({ data: utilisateurs })
                .then((createdUser) => {
                    console.log('Utilisateur créé avec succès:', createdUser);
                    resolve(createdUser);
                })
                .catch((error) => {
                    console.error(1);
                    reject('Erreur lors de la création de l\'utilisateur.');
                });
        } else {
            console.error(2);
            reject('Veuillez remplir tous les champs du formulaire.');
        }
    });
}

module.exports = { RegisterUser };
