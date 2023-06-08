const express = require('express');

const router = express.Router();

const officeController = require('../controllers/office/officeController');

router
    .route('/create-new-location')
    .post(officeController.createNewLocation);

router
    .route('/list-offices')
    .get(officeController.listOffices);

module.exports = router;