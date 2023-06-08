const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin/adminController');

router
    .route('/update-doctor')
    .post(adminController.updateDoctor);

router
    .route('/list-all/patients')
    .post(adminController.listPatients);

router
    .route('/list-all/doctors')
    .post(adminController.listDoctors);

router
    .route('/list-all-appointments')
    .post(adminController.listAppointment);


router
    .route('/signup')
    .post(adminController.postAdminSignUp);

module.exports = router;