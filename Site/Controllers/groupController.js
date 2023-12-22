const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { resolve } = require('path');

const { CreateGroup } = require('../Middlewares/creategroupe');
const { AddUserInGroup } = require('../Middlewares/adduseringroup');

// permet de récupérer les rappels pour les groupes 
function formaterRappels(rappels,user_email) {
    const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };

    // mets les dates et heures en format français et dans un tableau d'objets
    return rappels.map(rappel => {
        const date = new Date(rappel.date).toLocaleDateString('fr-FR', optionsDate);
        const time = new Date(rappel.time).toLocaleTimeString('fr-FR', optionsTime);

        // renvoi l'objet contenant date, time et user_email 
        return {
            ...rappel,
            date: date,
            time: time,
            user_email: user_email,
        };
    });
}

// Récupère la page du groupe 
async function getGroupPage(req, res) {
    try {
        const groupName = req.params.groupName;

        // Vérifie si l'utilisateur appartient au groupe
        const user = await prisma.utilisateurs.findUnique({
            where: { email: req.session.user.email },
            include: {
                Groupes_rejoints: {
                    where: { nom: groupName }, 
                    select: { nom: true }
                }
            }
        });

        if (!user || user.Groupes_rejoints.length === 0) {
            return res.status(403).send('Accès au groupe interdit');
        }

        // On récupère les rappels pour affichage et on les trie de manière chronologique 
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

        const Formated_rmdr = formaterRappels(reminders,req.session.user.email); // On récupère les rappels pour affichage sur le hbs
        res.render('groupe', { groupName, reminders: Formated_rmdr}); // on transmet les variables à l'hbs de groupe 
    } catch (error) {
        console.error('Erreur lors de la récupération des rappels :', error);
        res.status(500).send('Erreur serveur');
    }
};


// Ajout d'un user dans un groupe 
async function addUserInGroup(req, res) {
    const groupName = req.body.groupe; // on récupère le nom du groupe 
    try {
        await AddUserInGroup(req, res); // appelle la fonciton d'ajout 
        res.redirect("/groupe/" + groupName); // ramène l'utilisateur sur le groupe actuel 
    } catch (error) {
        if (error == 1) {
            console.err("groupe non trouvé"); 
            res.redirect("/groupe/" + groupName);
        } else if (error == 2) {
            console.err("Déjà dans le groupe"); 
            res.redirect("/groupe/" + groupName); 


        } else if (error == 3) {
            console.err("Email ou groupe invalide"); 
            res.redirect("/groupe/" + groupName);
        } else {
            console.error('Erreur lors de l\'ajout de l\'utilisateur au groupe :', error);
            res.status(500).send('Erreur serveur');
        }
    }
}

// renvoi le js pour ajouter un user au groupe 
function getAddUserInGroupJS(req, res) {
    res.sendFile(resolve(__dirname, "adduseringroupe.js"));
}

// permet de créer un groupe 
function createGroup (req, res) {
    // Vérification si l'utilisateur est connecté en vérifiant la session
    if (req.session.user) {
        CreateGroup(req, res)  // appelle de la fonction de création de groupe 
            .then(() => {
                // Après la création réussie, rechargement simple de la page
                res.redirect("/dashboard");
            })
            .catch((error) => {
                if (error == 1) {
                    console.err("Nom de groupe déjà utilisé ");
                    res.redirect("/dashboard");
                } else if (error == 2) {
                    console.err("Impossible de récupérer le nom du groupe");
                    res.redirect("/dashboard");
                }
            });
    } else {
        // Redirection vers la page de connexion si l'utilisateur n'est pas connecté
        res.redirect("login.html");
    }
};

// export des fonctions
module.exports = {
    getGroupPage,
    addUserInGroup,
    getAddUserInGroupJS,
    createGroup,
};
