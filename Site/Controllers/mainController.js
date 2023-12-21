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
            // On obtient les groupes de l'utilisateur depuis la base de données avec Prisma
            const user = await prisma.utilisateurs.findUnique({
                where: { email },
                include: {
                    Groupes_rejoints: {
                        select: { nom: true } // On sélectionne uniquement le nom du groupe
                    }
                }
            });
            
            if (!user) {
                console.error("Utilisateur non trouvé :", email);
                res.status(404).send('Utilisateur non trouvé');
                return;
            }

            const userGroups = user.Groupes_rejoints.map(group => group.nom);

            res.render('dashboard', { prenom, nom, email, userGroups });
        } catch (error) {
            console.error("Erreur lors de la récupération des groupes de l'utilisateur :", error);
            res.status(500).send('Erreur serveur');
        }
    } else {
        res.redirect("login.html");
    }
};

module.exports = {
    getHomePage,
    getDashboard,
};