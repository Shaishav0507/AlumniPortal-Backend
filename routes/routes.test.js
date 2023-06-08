const express = require('express');

const router = express.Router();

const testController = require('../controllers/test/testController');

router
    .route('/')
    .get(testController.testHome);

module.exports = router;