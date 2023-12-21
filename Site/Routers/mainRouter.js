const express = require ('express');
const mainRouter = express.Router();
const mainController = require("../Controllers/mainController")

mainRouter.get("/", mainController.getHomePage);

mainRouter.get("/dashboard", mainController.getDashboard);

module.exports = mainRouter;