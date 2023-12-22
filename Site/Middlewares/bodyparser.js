const express = require('express');

const bodyParserMiddleware = express.urlencoded({ extended: true }); // permet de récupérer la fonction permettant de récupérer les données postées 

// export du bodyparser 
module.exports = { bodyParserMiddleware };