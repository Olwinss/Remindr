const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function AddUserInGroup(req, res) {
    return new Promise(async (resolve, reject) => {
        const email = req.body.new_user_email;
        const groupId = req.body.groupe;

        if (!email || !groupId) {
            console.error(1); // 'Email ou groupe non valide'
            reject('Email ou groupe non valide');
            return;
        }

        try {
            const group = await prisma.groupe.findUnique({
                where: { nom: groupId },
                include: { Membres: true },
            });

            if (!group) {
                console.error("Groupe inexistant");
                reject(1);
                return;
            }

            // Vérifier si le membre existe déjà dans le groupe
            const isMemberAlready = group.Membres.some(member => member.email === email);
            if (isMemberAlready) {
                console.error("Membre déjà présent");
                reject(2);
                return;
            }

            const user = await prisma.utilisateurs.findUnique({
                where: { email: email },
            });


            if (user) {      // Ajouter le membre au groupe
                await prisma.groupe.update({
                    where: { nom: groupId },
                    data: {
                        Membres: {
                            connect: { email: email },
                        },
                    },
                });

                console.log('Utilisateur ajouté avec succès');
                resolve({ success: true });
            }
            else
            {
                console.log('Impossible de trouver l\'utilisateur');
                resolve({ success: false });
            }

        }
        catch (error) {
            console.error(error.message);
            reject(error.message);
        }
    });
}

module.exports = { AddUserInGroup };
