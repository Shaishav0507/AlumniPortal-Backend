const express = require('express');

const router = express.Router();

const databaseController = require('../controllers/db/databaseController');

router
    .route('/drop')
    .get(databaseController.dbDrop);

module.exports = router;