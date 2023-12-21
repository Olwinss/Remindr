const express = require ('express');
const router = express.Router();
const mainController = require("../Controllers/mainController")

router.get("/", mainController.getHomePage);

router.get("/dashboard", mainController.getDashboard);

module.exports = rooter;