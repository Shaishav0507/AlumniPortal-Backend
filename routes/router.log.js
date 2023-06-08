const express = require('express');

const router = express.Router();

const logController = require('../controllers/log/logController');

router
    .route('/')
    .get(logController.logHome);

module.exports = router;