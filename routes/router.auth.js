const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth/authController');

router
    .route('/login')
    .post(authController.postLogin);

router
    .route('/signup')
    .post(authController.postSignup);

router
    .route('/gen-reset-token')
    .post(authController.genReset);

router
    .route('/reset-token')
    .post(authController.getReset);

router
    .route('/reset-password')
    .post(authController.resetPass);

router
    .route('/verify-auth-token')
    .post(authController.verifyAuthToken);

module.exports = router;