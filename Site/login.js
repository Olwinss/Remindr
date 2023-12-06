async function LoginUser() {
    console.log("ENTREE");
    var log_email = document.registration.email; 
    var log_pswd = document.registration.password;
    if (log_email && log_pswd)
    {
        const logUser = await prisma.utilisateurs.findUnique({
            where: {
                email: log_email,
                password: log_pswd
            }
        })
    }
    console.log("SORTIE");
}