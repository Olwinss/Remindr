const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function loginUser(req, res) {
    const log_email = req.body.email;
    const log_pswd = req.body.password;

    if (log_email && log_pswd) {
        const logUser = await prisma.utilisateurs.findUnique({
            where: {
                email: log_email,
                password: log_pswd
            }
        });

        if (logUser) {
            // L'utilisateur a été trouvé
            console.log("Authentification réussie.");
        } else {
            // Aucun utilisateur trouvé
            reject("Aucun utilisateur trouvé pour l'email et le mot de passe fournis.");
        }
    } else {
        reject("Les informations d'identification sont incomplètes.");
    }
}

module.exports = { loginUser };
