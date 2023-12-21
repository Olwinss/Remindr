const express = require('express');
const reminderRouter = express.Router();
const reminderController = require('../Controllers/reminderController');
const { bodyParserMiddleware } = require('../Middlewares/bodyparser');

// Routes pour les rappels
reminderRouter.post('/ajouterrappel', bodyParserMiddleware, reminderController.addReminder);
reminderRouter.get('/ajouterrappel.js', reminderController.getAddReminderJS);
reminderRouter.post('/updatereminder', bodyParserMiddleware, reminderController.updateReminder);
reminderRouter.get('/updatereminder.js', reminderController.getUpdateReminderJS);
reminderRouter.post('/deletereminder', bodyParserMiddleware, reminderController.deleteReminder);
reminderRouter.get('/deletereminder.js', reminderController.getDeleteReminderJS);

module.exports = reminderRouter;
