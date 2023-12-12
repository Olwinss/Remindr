const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function loginUser(req, res) {
    const log_email = req.body.email;
    const log_pswd = req.body.password;

    if (log_email && log_pswd) {
        try {
            const logUser = await prisma.utilisateurs.findUnique({
                where: {
                    email: log_email,
                    password: log_pswd
                }
            });
        } catch (error) {
            console.error("Error retrieving user:", error);
        }
    }
}

module.exports = { loginUser };
