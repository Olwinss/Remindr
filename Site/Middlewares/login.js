const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function loginUser(req, res) {
    try {
        const log_email = req.body.email;
        const log_pswd = req.body.password;

        if (log_email && log_pswd) {
            const logUser = await prisma.utilisateurs.findUnique({
                where: {
                    email: log_email,
                    password: log_pswd,
                },
            });

            if (logUser) {
                return logUser;
            } else {
                throw new Error("Aucun utilisateur trouvé pour l'email et le mot de passe fournis.");
            }
        } else {
            throw new Error("Les informations d'identification sont incomplètes");
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { loginUser };