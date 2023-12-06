async function RegisterUser() {
    var new_firstname = document.registration.new_firstname
    var new_surname = document.registration.new_surname
    var new_email = document.registration.new_email; 
    var new_pswd = document.registration.new_password;
    if (new_email && new_pswd)
    {
        utilisateurs = {
            email: new_email,
            prenom: new_firstname,
            nom: new_surname, 
            password: new_pswd,
        }
        const createUser = await prisma.utilisateurs.create({ data: utilisateurs, })
    }

}