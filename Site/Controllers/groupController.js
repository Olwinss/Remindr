const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { resolve } = require('path');

const { CreateGroup } = require('../Middlewares/creategroupe');
const { AddUserInGroup } = require('../Middlewares/adduseringroup');

function formaterRappels(rappels,user_email) {
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };

    return rappels.map(rappel => {
        const date = new Date(rappel.date).toLocaleDateString('fr-FR', optionsDate);
        const time = new Date(rappel.time).toLocaleTimeString('fr-FR', optionsTime);

        return {
            ...rappel,
            date: date,
            time: time,
            user_email: user_email,
        };
    });
}

async function getGroupPage(req, res) {
    try {
        const groupName = req.params.groupName;

        // Vérifiez si l'utilisateur appartient au groupe
        const user = await prisma.utilisateurs.findUnique({
            where: { email: req.session.user.email },
            include: {
                Groupes_rejoints: {
                    where: { nom: groupName }, // Filtrez le groupe spécifique
                    select: { nom: true }
                }
            }
        });

        if (!user || user.Groupes_rejoints.length === 0) {
            // L'utilisateur n'appartient pas au groupe, rediriger ou envoyer une erreur
            return res.status(403).send('Accès interdit');
        }

        // L'utilisateur appartient au groupe, continuez avec la logique existante pour récupérer les rappels, etc.
        const reminders = await prisma.rappels.findMany({
            where: { nom_groupe: groupName },
            orderBy: [
              {
                date: 'asc',
              },
              {
                time: 'asc',
              },
            ],
        });

        const Formated_rmdr = formaterRappels(reminders,req.session.user.email);
        res.render('groupe', { groupName, reminders: Formated_rmdr});
    } catch (error) {
        console.error('Erreur lors de la récupération des rappels :', error);
        res.status(500).send('Erreur serveur');
    }
};


async function addUserInGroup(req, res) {
    const groupName = req.body.groupe;
    try {
        await AddUserInGroup(req, res);
        res.redirect("/groupe/" + groupName);
    } catch (error) {
        if (error == 1) {
            res.redirect("/groupe/" + groupName);
            // groupe non trouvé 
        } else if (error == 2) {
            res.redirect("/groupe/" + groupName);
            // Déjà dans le groupe 
        } else if (error == 3) {
            res.redirect("/groupe/" + groupName);
            // Email ou groupe invalide
        } else {
            console.error('Erreur lors de l\'ajout de l\'utilisateur au groupe :', error);
            res.status(500).send('Erreur serveur');
        }
    }
}


function getAddUserInGroupJS(req, res) {
    res.sendFile(resolve(__dirname, "adduseringroupe.js"));
}

function createGroup (req, res) {
    // Vérification si l'utilisateur est connecté en vérifiant la session
    if (req.session.user) {
        const { prenom, nom, email } = req.session.user;
        CreateGroup(req, res)
            .then(() => {
                // Après la création réussie, rechargement simple de la page
                res.redirect("/dashboard");
            })
            .catch((error) => {
                if (error == 1) {
                    res.render('dashboard', { prenom, nom, email }); // dire que nom de groupe déjà utilisé 
                } else if (error == 2) {
                    res.render('dashboard', { prenom, nom, email }); // dire que impossible de récupérer le nom du groupe
                }
            });
    } else {
        // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
        res.redirect("login.html");
    }
};


module.exports = {
    getGroupPage,
    addUserInGroup,
    getAddUserInGroupJS,
    createGroup,
};
