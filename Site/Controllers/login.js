const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function LoginUser(prisma, req, res) {
    console.log("ENTREE dans LoginUser()");
    var log_email = req.query.email;
    var log_pswd = req.query.password;
    if (log_email && log_pswd) {
        try {
            const logUser = await prisma.utilisateurs.findUnique({
                where: {
                    email: log_email,
                    password: log_pswd
                }
            });
            console.log(logUser); // Assuming you want to log the user details
        } catch (error) {
            console.error("Error retrieving user:", error);
        }
    }
    console.log(log_email);
    console.log(log_pswd);
    console.log("SORTIE de LoginUser()");
}

module.exports = { LoginUser };
