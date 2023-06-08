const express = require('express');

const router = express.Router();

const userController = require('../controllers/user/userController');

const upload = require('../utils/multer-use');

router
    .route('/update')
    .post(upload.uploadMulter.single("fileUpload"), userController.updateUser);

router
    .route('/dashboard')
    .post(upload.uploadMulter.none(), userController.userDashboard);
    
router
    .route('/feedback')
    .post(upload.uploadMulter.none(), userController.userFeedback);

router
    .route('/change-password')
    .post(upload.uploadMulter.none(), userController.updateUserPassword);

module.exports = router;