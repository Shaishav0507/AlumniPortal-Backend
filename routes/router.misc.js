const express = require('express');

const router = express.Router();

const miscController = require('../controllers/misc/miscController');

router
    .route('/')
    .get(miscController.miscHome);

module.exports = router;