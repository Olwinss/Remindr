const express = require('express');
const router = express.Router();
const groupController = require('../Controllers/groupController');
const { bodyParserMiddleware } = require('../Middlewares/bodyparser');

// Routes pour les groupes
router.get('/groupe/:groupName', groupController.getGroupPage);
router.post('/adduseringroupe', bodyParserMiddleware, groupController.addUserInGroup);
router.get('/adduseringroupe.js', groupController.getAddUserInGroupJS);
router.post('/creategroupe', bodyParserMiddleware, groupController.createGroup);

module.exports = router;
