const {resolve} = require('path');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function getHomePage(req, res) {
    res.sendFile(resolve(__dirname, "../Templates/login.html"));
};

// renvoi le dashboard 
async function getDashboard(req, res) {
    if (req.session.user) {
        const { prenom, nom, email } = req.session.user; // récupère le nom, prenom adresse 

        try {
            // récupère les groupes du user
            const user = await prisma.utilisateurs.findUnique({
                where: { email },
                include: {
                    Groupes_rejoints: {
                        select: { nom: true } // Récupère le nom du groupe
                    }
                }
            });

            if (!user) { // si pas d'utilisateur trouvé
                console.error("Utilisateur non trouvé :", email);
                res.status(404).send('Utilisateur non trouvé');
                return;
            }

            const currentDate = new Date(); // on prends la date du jour 
            currentDate.setHours(0, 0, 0, 0); // on la met à 00:00:00:000 pour récupérer tous les rappels du jour 

            const allReminders = await prisma.utilisateurs.findMany({ // cherches les rappels appartenant à l'utilisateur actuel et prends ceux du jour ou des jours à venir
                where: { email },
                include: {
                    Groupes_rejoints: {
                        select: {
                            Rappel: {
                                where: {
                                    OR: [ // les expressions qui suivent utiliseront l'opérateur de ou logique
                                        {
                                            date: {
                                                gt: currentDate // Rappels avec date supérieure à l'heure actuelle
                                            },
                                        },
                                        {
                                            date: {
                                                equals: currentDate // Rappels avec date égal à l'heure actuelle
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            });

            const userGroups = user.Groupes_rejoints.map(group => group.nom); // Mets tous les objets groups sur le même niveau (niveau 1) 

            const Formated_reminders = allReminders[0].Groupes_rejoints.flatMap(group => group.Rappel); // On formate les reminders : on récupère le premier element de allreminders qui concerne notre user, on prends ses groupes rejoints et on récupère les rappels en applatissant le tableau
            Formated_reminders.sort((a, b) => { // on tri les rappels de manière chronologique
                const dateA = new Date(`${a.date} ${a.time}`);
                const dateB = new Date(`${b.date} ${b.time}`);
                return dateA - dateB;
            });
            res.render('dashboard', { prenom, nom, email, userGroups, allreminders: Formated_reminders }); // on affiche dashboard avec les variables
        } catch (error) {
            console.error("Erreur lors de la récupération des groupes de l'utilisateur :", error);
            res.status(500).send('Erreur serveur');
        }
    } 
    else
    {
        res.redirect("/login.html");
    }
};


// export des fonctions 
module.exports = {
    getHomePage,
    getDashboard,
};