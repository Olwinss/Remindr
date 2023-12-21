const express = require('express');
const router = express.Router();
const reminderController = require('../Controllers/reminderController');
const { bodyParserMiddleware } = require('../Middlewares/bodyparser');

// Routes pour les rappels
router.post('/ajouterrappel', bodyParserMiddleware, reminderController.addReminder);
router.get('/ajouterrappel.js', reminderController.getAddReminderJS);
router.post('/updatereminder', bodyParserMiddleware, reminderController.updateReminder);
router.get('/updatereminder.js', reminderController.getUpdateReminderJS);
router.post('/deletereminder', bodyParserMiddleware, reminderController.deleteReminder);
router.get('/deletereminder.js', reminderController.getDeleteReminderJS);

module.exports = router;
