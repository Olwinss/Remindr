const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// permet de modifier un rappel existant 
async function UpdateReminder(req, res) {
    return new Promise(async (resolve, reject) => {

        //on récupère les nouvelles informations ainsi que l'ancien nom 

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
       
        const updateUser = await prisma.rappels.update({ // on met à jour 
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
    const [year, month, day] = dateString.split("-"); // récupère year, month, day à partir de la date fourni. On récupère la chaîne de char entre chaque - 
    const [hours, minutes] = timeString.split(":"); // idem pou les heures et minutes
    const dateTime = new Date(year, month - 1, day, hours, minutes); // on créer la nouvelle date 
  
    return dateTime.toISOString(); // on retourne la date en string
  }

  // export la fonction 
module.exports = { UpdateReminder };
