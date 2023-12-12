const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function CreateGroup(req,res) {
    console.log(req.body);
    const name = req.body.groupename;
    const creator = "labrosseolivier2004@gmail.com" // adapter pour avoir l'email de la session
    if (name) {
        groupe = {
            nom: name,
            email_createur: creator,
        }
        try {
            const createUser = await prisma.groupe.create({ data: groupe })
            console.log('Groupe créé avec succès');
        }
        catch (error) {
            console.error('Erreur lors de la création du groupe :', error);
        }
    }
    else
    { 
        console.error('Veuillez entrer un nom de groupe.');

        return false; // Pour empêcher la soumission du formulaire
    }
}

module.exports = { CreateGroup };