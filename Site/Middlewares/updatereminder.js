const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function UpdateReminder(req, res) {
    return new Promise(async (resolve, reject) => {
        const group_name = req.body.groupe;
        const old_reminder_name = req.body.old_reminder_name;
        const reminder_name = req.body.nom;
        const description = req.body.description;
        const dateEcheance = req.body.dateEcheance;
        const heureEcheance = req.body.heureEcheance;
        const couleur = req.body.couleur;


        try
        {
        var Date = createISO8601DateTime(dateEcheance, heureEcheance); // converti au format : yyyy-mm-ddThh:mm:ss.000Z
       
        console.log(reminder_name);
        const updateUser = await prisma.rappels.update({
            where: {
                nom_groupe_nom_rappel: {
                    nom_groupe: group_name,
                    nom_rappel: old_reminder_name,
                },
            },
            data: {
                nom_groupe: group_name,
                nom_rappel: reminder_name,
                description: description,
                date: Date,
                time: Date,
                couleur: couleur,
            },
        });

        console.log("Reminder updated");
        resolve(updateUser);
    }
    catch (error)
    {
        reject(error);
    }
    });
}

function createISO8601DateTime(dateString, timeString) {
    const [year, month, day] = dateString.split("-");
    const [hours, minutes] = timeString.split(":");
    const dateTime = new Date(year, month - 1, day, hours, minutes);

    return dateTime.toISOString();
}

module.exports = { UpdateReminder };
