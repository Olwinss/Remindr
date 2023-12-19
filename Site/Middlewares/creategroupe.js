const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function CreateGroup(req, res) {
    return new Promise(async (resolve, reject) => {
        const name = req.body.groupename;
        const { email } = req.session.user; // On récupère l'email du createur
        const creator = email;

        if (name) {
            const groupe = {
                nom: name,
                email_createur: creator,
            };

            try {
                // Créer le groupe
                const createUser = await prisma.groupe.create({ data: groupe });
                console.log('Groupe créé avec succès');

                resolve(createUser);
            } 
            catch (error) { // Nom déjà utilisé
                console.error("Nom déjà utilisé");
                reject(1);
            }

            try {
                // Ajouter l'utilisateur à la table _Joined
                await prisma.groupe.update({
                    where: { nom: groupe.nom},
                    data: {
                        Membres: {
                            connect: { email: creator },
                        },
                    },
                });           
            }
            catch{
                console.error("Ajout dans _Joined échoué");
                reject(3);
            }

        } else {
            console.error("Impossible de récupérer le nom");
            reject(2);
        }
    });
}

module.exports = { CreateGroup };
