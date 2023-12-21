const express = require('express');
const authRouter = express.Router();
const authController = require("../Controllers/authController");
const { bodyParserMiddleware } = require('../Middlewares/bodyparser');

console.log("Routeur")
// Routes d'authentification
authRouter.post('/login', authController.loginUserController);
authRouter.get('/login.html', authController.getLoginPage);
authRouter.post('/register', bodyParserMiddleware, authController.registerUserController);
authRouter.get('/register.html', authController.getRegisterPage);
authRouter.get('/logout', authController.logoutUser);

module.exports = authRouter;