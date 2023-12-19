const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function loginUser(req, res) {
    try {
        const log_email = req.body.email;
        const log_pswd = req.body.password;

        if (log_email && log_pswd) {
            // Recherche de l'utilisateur par son adresse e-mail
            const logUser = await prisma.utilisateurs.findUnique({
                where: {
                    email: log_email,
                },
            });

            if (logUser) {
                // Comparaison du mot de passe haché avec le mot de passe fourni
                const passwordMatch = await bcrypt.compare(log_pswd, logUser.password);

                if (passwordMatch) {
                    // Mot de passe correct, l'utilisateur est authentifié
                    return logUser;
                } else {
                    throw new Error('Mot de passe incorrect');
                }
            } else {
                throw new Error("Aucun utilisateur trouvé pour l'email fourni.");
            }
        } else {
            throw new Error("Les informations d'identification sont incomplètes");
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { loginUser };