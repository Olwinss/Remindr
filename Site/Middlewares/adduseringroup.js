const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function AddUserInGroup(req, res,groupe) {
    return new Promise(async (resolve, reject) => {
        console.log(req.body);
        const email = req.body.new_user_email;

        if (email && groupe) {
            try {
               // Ajouter un user dans le groupe de la page
            } catch (error) { // Email non trouvé
                console.error(1); 
                reject(error);
            }
        } else { // Aucun email entré ou groupe non reconnu
            console.error(2);
            reject("Aucun email entré ou groupe non reconnu");
        }
    });
}

module.exports = { AddUserInGroup };