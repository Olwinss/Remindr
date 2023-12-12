const express = require('express');

const bodyParserMiddleware = express.urlencoded({ extended: true });

module.exports = { bodyParserMiddleware };