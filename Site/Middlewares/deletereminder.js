const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function DeleteReminder(req, res) {
    return new Promise(async (resolve, reject) => {
        const group_name = req.body.groupe;
        const reminder_name = req.body.reminder_name;


        console.log(reminder_name);
        try {
            const deleteReminder = await prisma.rappels.delete({
                where: {
                    nom_groupe_nom_rappel: {
                        nom_groupe: group_name,
                        nom_rappel: reminder_name,
                    },
                },
            })
            console.log("Reminder deleted");
            resolve(deleteReminder);
        }
        catch (error) 
        {
            reject(error);
        }

    });
}

module.exports = { DeleteReminder };
