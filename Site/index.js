//Importation des Routeurs
const mainRouter = require('./Routers/mainRouter');
const authRouter = require('./Routers/authRouter');
const groupRouter = require('./Routers/groupRouter');
const reminderRouter = require('./Routers/reminderRouter');

const express = require('express');
const { urlencoded } = require('express');
const { resolve } = require('path');
const { PrismaClient } = require('@prisma/client')
const cookieParser = require("cookie-parser");
const session = require('express-session');
const handlebars = require('handlebars');
const exphbs = require('express-handlebars').create({
    layoutsDir: resolve(__dirname, 'Templates'), // Chemin des layouts à suivre
    defaultLayout: false,
    extname: '.hbs',
});

const app = express();
const prisma = new PrismaClient();
const port = 3010;

app.set('views', resolve(__dirname, 'Templates'));
app.engine('.hbs', exphbs.engine);
app.set('view engine', '.hbs');

// Styles 
app.use(express.static('public'));

// Sessions
app.use(cookieParser());
app.use(session({
    secret: 'Remindr',
    resave: false,
    saveUninitialized: true,
}));

app.use(urlencoded({ extended: false }));

// Utilisation des routeurs
app.use(mainRouter);
app.use(authRouter);
app.use(groupRouter);
app.use(reminderRouter);

// handlebars Helpers 
handlebars.registerHelper('isCreator', function (reminderCreatorEmail, user_email) 
{
    return user_email == reminderCreatorEmail;
});

handlebars.registerHelper('GetStyle', function(dateEcheance, heureEcheance, couleur) 
{
    // Récupération de la date actuelle
    var currentDate = new Date();

    // Parsing des valeurs de date et d'heure
    const [day, month, year] = dateEcheance.split("/");
    const [hours, minutes] = heureEcheance.split(":");
    
    // Création de l'objet dateTime
    const dateTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);

    if (currentDate > dateTime) {
        // Date dépassée
        return "background-color: " + couleur + "; border: 4px solid #000000; font-weight: bold; border-style: dotted; color: " + (isColorDark(couleur) ? "white" : "black") + ";";
    } else {
        // Calcul de la différence de temps en heures
        var timeDifference = dateTime - currentDate;
        var hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference - 1 <= 24) { 
            // Date à venir dans les prochaines 24 heures
            return "background-color: " + couleur + "; border: 4px solid #000000; font-style: italic; border-style: dotted dashed solid double; color: " + (isColorDark(couleur) ? "white" : "black") + ";";
        } else {
            // Date à venir dans plus de 24 heures
            return "background-color: " + couleur + "; border: 4px solid #000000; border-style: solid; color: " + (isColorDark(couleur) ? "white" : "black") + ";";
        }
    }
});

// Fonction pour vérifier si une couleur est foncée
function isColorDark(color) {
    // Vous pouvez utiliser une logique plus avancée ici pour déterminer si la couleur est foncée ou claire
    // Cette implémentation simple suppose que la couleur est foncée si la luminosité moyenne est inférieure à 128
    const rgb = parseInt(color.slice(1), 16); 
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >>  8) & 0xff;
    const b = (rgb >>  0) & 0xff;

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    return brightness < 128;
}

// Listening port 

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});


