const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');

// Routes d'authentification
router.post('/login', authController.loginUser);
router.get('/login.html', authController.getLoginPage);
router.post('/register', bodyParserMiddleware, authController.registerUser);
router.get('/register.html', authController.getRegisterPage);
router.get('/logout', authController.logoutUser);

module.exports = router;