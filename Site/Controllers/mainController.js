const {resolve} = require('path');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function getHomePage(req, res) {
    res.sendFile(resolve(__dirname, "../Templates/login.html"));
};


async function getDashboard(req, res) {
    if (req.session.user) {
        const { prenom, nom, email } = req.session.user;

        try {
            // Obtenez les groupes de l'utilisateur depuis la base de données avec Prisma
            const user = await prisma.utilisateurs.findUnique({
                where: { email },
                include: {
                    Groupes_rejoints: {
                        select: { nom: true } // Sélectionnez uniquement le nom du groupe
                    }
                }
            });

            if (!user) {
                console.error("Utilisateur non trouvé :", email);
                res.status(404).send('Utilisateur non trouvé');
                return;
            }

            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Set the time to the beginning of the current day

            const allReminders = await prisma.utilisateurs.findMany({
                where: { email },
                include: {
                    Groupes_rejoints: {
                        select: {
                            Rappel: {
                                where: {
                                    AND: [
                                        {
                                            date: {
                                                gt: currentDate // Rappels avec date supérieure à l'heure actuelle
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            });

            const userGroups = user.Groupes_rejoints.map(group => group.nom);

            const Formated_reminders = allReminders[0].Groupes_rejoints.flatMap(group => group.Rappel);
            Formated_reminders.sort((a, b) => {
                const dateA = new Date(`${a.date} ${a.time}`);
                const dateB = new Date(`${b.date} ${b.time}`);
                return dateA - dateB;
            });
            res.render('dashboard', { prenom, nom, email, userGroups, allreminders: Formated_reminders });
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


module.exports = {
    getHomePage,
    getDashboard,
};