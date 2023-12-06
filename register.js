async function formValidation() {
    var firstname = document.registration.new_firstname
    var surname = document.registration.new_surname
    var email = document.registration.new_email; 
    var pswd = document.registration.new_password;
    if (email && pswd)
    {
        const createUser = await prisma.utilisateurs.create({ data: user, })
    }
}
