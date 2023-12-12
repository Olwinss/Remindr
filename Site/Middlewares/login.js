const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function loginUser(req, res) {
    console.log("ENTREE dans loginUser()");
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
            console.log("L'utilisateur est :");
            console.log(logUser); // Assuming you want to log the user details
        } catch (error) {
            console.error("Error retrieving user:", error);
        }
    }

    console.log(log_email);
    console.log(log_pswd);
    console.log("SORTIE de loginUser()");
}

module.exports = { loginUser };