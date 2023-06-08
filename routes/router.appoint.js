const express = require('express');

const router = express.Router();

const appointmentController = require('../controllers/appointment/appointmentController');

router
    .route('/check-book-now')
    .post(appointmentController.checkBookAppointment);

router
    .route('/book-now')
    .post(appointmentController.bookAppointment);

router
    .route('/update')
    .post(appointmentController.updateAppointment);

router
    .route('/create-new-type')
    .post(appointmentController.createNewType);

router
    .route('/list-types')
    .get(appointmentController.listAppointmentTypes);

module.exports = router;