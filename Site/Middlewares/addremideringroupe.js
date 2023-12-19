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
        const { email } = req.session.user; // On récupère l'email du createur

        if (group_name && reminder_name && description && dateEcheance && heureEcheance && couleur) {
            var Date = createISO8601DateTime(dateEcheance,heureEcheance); // converti au format : yyyy-mm-ddThh:mm:ss.000Z

            const rappel = {
                nom_groupe: group_name,
                nom_rappel: reminder_name,
                description: description,
                date: Date, 
                time: Date,
                couleur: couleur,
                email_createur: email,
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

function createISO8601DateTime(dateString, timeString) {
    const [year, month, day] = dateString.split("-");
    const [hours, minutes] = timeString.split(":");
    const dateTime = new Date(year, month - 1, day, hours, minutes);
  
    return dateTime.toISOString();
  }

module.exports = { AddReminderInGroup };
