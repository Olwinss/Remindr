const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function AddReminderInGroup(req, res) {
    return new Promise(async (resolve, reject) => {
        const group_name = req.body.groupe;
        const reminder_name = req.body.nom;
        const description = req.body.description;
        const dateEcheance = req.body.dateEcheance;
        const heureEcheance = req.body.heureEcheance;
        const couleur = req.body.couleur;

        console.log({
            nom_groupe: group_name,
            nom_rappel: reminder_name,
            description: description,
            date: dateEcheance,
            time: heureEcheance,
            couleur: couleur,
        });

        if (group_name && reminder_name && description && dateEcheance && heureEcheance && couleur) {
            const formattedDate = formatDate(dateEcheance);
            const formattedDate = formatDateTime(dateEcheance, heureEcheance);
            const rappel = {
                nom_groupe: group_name,
                nom_rappel: reminder_name,
                description: description,
                date: formattedDate,
                time: formattedTime,
                couleur: couleur,
            };

            try {
                const createUser = await prisma.rappels.create({ data: rappel });
                console.log('Rappel créé avec succès');
                resolve(createUser);
            } catch (error) {
                console.error(error);
                reject(error);
            }
        } else {
            console.error(2);
            reject("Impossible de récupérer les informations du rappel");
        }
    });
}

function formatDate(inputDate) {
    // Convertit la date au format ISO-8601
    const dateObject = new Date(inputDate);
    return dateObject.toISOString();
}

// Fonction pour formater la date et l'heure en ISO-8601 DateTime
function formatDateTime(date, time) {
    const isoDateTime = new Date(`${date}T${time}:00`).toISOString();
    return isoDateTime;
}


module.exports = { AddReminderInGroup };
