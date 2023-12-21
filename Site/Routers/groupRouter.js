const express = require('express');
const groupRouter = express.Router();
const groupController = require('../Controllers/groupController');
const { bodyParserMiddleware } = require('../Middlewares/bodyparser');

// Routes pour les groupes
groupRouter.get('/groupe/:groupName', groupController.getGroupPage);
groupRouter.post('/adduseringroupe', bodyParserMiddleware, groupController.addUserInGroup);
groupRouter.get('/adduseringroupe.js', groupController.getAddUserInGroupJS);
groupRouter.post('/creategroupe', bodyParserMiddleware, groupController.createGroup);

module.exports = groupRouter;
