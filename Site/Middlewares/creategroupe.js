const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function CreateGroup(req, res) {
    return new Promise(async (resolve, reject) => {
        const name = req.body.groupename;
        const {email} = req.session.user; // On récupère l'email du createur
        const creator = email;

        if (name) {
            const groupe = {
                nom: name,
                email_createur: creator,
            };

            try {
                const createUser = await prisma.groupe.create({ data: groupe });
                console.log('Groupe créé avec succès');
                resolve(createUser); 
            } catch (error) { // Nom déjà utiliser
                console.error(1);
                reject(error); 
            }
        } else {
            console.error(2);
            reject("Impossible de recupere le nom"); 
        }
    });
}

module.exports = { CreateGroup };