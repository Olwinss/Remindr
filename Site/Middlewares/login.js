const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function loginUser(req, res) {
    return new Promise((resolve, reject) => {
        const log_email = req.body.email;
        const log_pswd = req.body.password;

        if (log_email && log_pswd) {
            prisma.utilisateurs
                .findUnique({
                    where: {
                        email: log_email,
                        password: log_pswd
                    }
                })
                .then((logUser) => {
                    if (logUser) {
                        // L'utilisateur a été trouvé
                        console.log("Authentification réussie.");
                        resolve(logUser);
                    } else {
                        // Aucun utilisateur trouvé
                        console.error(1);
                        reject("Aucun utilisateur trouvé pour l'email et le mot de passe fournis.");
                    }
                })
                .catch((error) => {
                    console.error(2);
                    reject("Une erreur s'est produite lors de l'authentification.");
                });
        } else {
            console.error(2);
            reject("Les informations d'identification sont incomplètes");
        }
    });
}

module.exports = { loginUser };
