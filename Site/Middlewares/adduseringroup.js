const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ajout du user dans un groupe 
async function AddUserInGroup(req, res) {
    return new Promise(async (resolve, reject) => {

        // récupère les données du formulaire
        const email = req.body.new_user_email;
        const groupId = req.body.groupe;

        if (!email || !groupId) { 
            console.error('Email ou groupe non valide'); // 'Email ou groupe non valide'
            reject(3);
            return;
        }

        try {
            const group = await prisma.groupe.findUnique({ // cherche le groupe 
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

            const user = await prisma.utilisateurs.findUnique({ // on récupère le user pour le tester 
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


// export la fonction 
module.exports = { AddUserInGroup };
