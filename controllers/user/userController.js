const jwt = require('jsonwebtoken');

const userMongo = require('../../models/schemas/auth/user');

const appointMongo = require('../../models/schemas/appointment/appointment');
const feedbackMongo = require('../../models/schemas/misc/feedbackLogs');
const totalFeedbackMongo = require('../../models/schemas/misc/totalFeedback');
const bcrypt = require('bcryptjs')

const updateUserFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        const token = req.body.userToken;
        const userId = req.body.userId;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const birthDate = req.body.birthDate;
        const contactNumber = req.body.contactNumber;
        const location = req.body.location;
        const fileUploaded = req.file;

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
            audience: 'AuthToken',
            issuer: 'API'
        });

        if (userId == verifyToken.userId) {
            const user = await userMongo.findById(userId).select("-password");

            if (user) {
                if (firstName && birthDate && contactNumber) {
                    const status = user.status == 0 ? 1 : user.status;

                    user.firstName = firstName;
                    user.lastName = lastName;
                    user.birthDate = new Date(birthDate);
                    user.contactNumber = contactNumber;
                    user.status = status;
                    if (location) {
                        user.location = location
                    }
                    if (fileUploaded) {
                        user.fileUploaded = "uploads/" + fileUploaded.filename;
                    }
                    user.save();

                    statusCode = 200;
                    statusMessage = "User details updated successfully";
                    dataObject.userInfo = user;
                }
                else {
                    statusCode = 204;
                    statusMessage = "Not each required information present";
                    dataObject.errors = {};
                    if (!firstName) dataObject.errors.firstName = "Please enter your first name";
                    if (!birthDate) dataObject.errors.birthDate = "Please provide your birth date";
                    if (!contactNumber) dataObject.errors.contactNumber = "Please provide your contact number";
                }
            }
            else {
                statusCode = 401;
                statusMessage = "Not authorized";
            }

        }
        else {
            statusCode = 401;
            statusMessage = "Not authorized";
        }


        dataObject.message = statusMessage;

        res.locals.statusCode = statusCode;
        res.locals.dataObject = dataObject;
        res.locals.statusMessage = statusMessage;

        next();
    }
    catch (err) {
        next(err);
    }
};

const userDashboardFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        const token = req.body.userToken;
        const userId = req.body.userId;

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
            audience: 'AuthToken',
            issuer: 'API'
        });

        if (userId == verifyToken.userId) {
            const user = await userMongo.findById(userId).select("-password");

            if (user) {
                const roleUser = user.role;
                if (user.role == 1) {
                    // patient dashboard

                    const bookedAppointments = await appointMongo.find({ userId: userId }).populate("userId docUserId type location", "-password");

                    dataObject.appointments = bookedAppointments;
                    statusCode = 200;
                    statusMessage = "Patient Dashboard Details";
                }
                else if (user.role == 2) {
                    // doctor dashboard

                    const bookedAppointments = await appointMongo.find({ docUserId: userId }).populate("userId docUserId type location", "-password");

                    dataObject.appointments = bookedAppointments;
                    statusCode = 200;
                    statusMessage = "Doctor Dashboard Details";
                }
                else {
                    statusCode = 402;
                    statusMessage = "User could not be identified";
                }
            }
            else {
                statusCode = 401;
                statusMessage = "Not authorized";
            }

        }
        else {
            statusCode = 401;
            statusMessage = "Not authorized";
        }


        dataObject.message = statusMessage;

        res.locals.statusCode = statusCode;
        res.locals.dataObject = dataObject;
        res.locals.statusMessage = statusMessage;

        next();
    }
    catch (err) {
        next(err);
    }
};

const userFeedbackFnction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";
        const userId = req.body.userId;
        const feedback = req.body.feedback;
        const user = await userMongo.findById(userId);
        if (user) {
            let feedabackObj = {};
            let totalFeedbackObj = {};
            const totalFeedback = await totalFeedbackMongo.findOne({ feedback: 'feedback' });
            feedabackObj.feedback = feedback;
            feedabackObj.user = user;
            
            if (!totalFeedback) {
                totalFeedbackObj.greatFeedback = 0;
                totalFeedbackObj.goodFeedback = 0;
                totalFeedbackObj.badFeedback = 0;
                totalFeedbackObj.total = 1;
                if (feedback == 'Great') {
                    totalFeedbackObj.greatFeedback = 1;
                }
                else if (feedback == 'Bad') {
                    totalFeedbackObj.badFeedback = 1;
                }
                else if (feedback == 'Good') {
                    totalFeedbackObj.goodFeedback = 1;
                }
                totalFeedbackObj.feedback = 'feedback';
                totalFeedbackObj.users = user;
                const userObj = new totalFeedbackMongo(totalFeedbackObj);
                await userObj.save()

            }

            else {
                totalFeedback.total += 1;
                if (feedback == 'Great') {
                    totalFeedback.greatFeedback += 1;
                }
                else if (feedback == 'Bad') {
                    totalFeedback.badFeedback += 1;
                }
                else if (feedback == 'Good') {
                    totalFeedback.goodFeedback += 1;
                }
                totalFeedback.feedback = 'feedback';
                totalFeedback.users = user;

                await totalFeedback.save()
            }

            const feedbackLogsObj = new feedbackMongo(feedabackObj)
           let abcd= await feedbackLogsObj.save();

            statusCode=200;
            statusMessage="Data Saved successfully";
        }

        else {
            statusCode = 402;
            dataObject.error = "User does not exist";
            statusMessage = "User does not exist"
        }
        console.log('data', dataObject)
        dataObject.message = statusMessage;
        res.locals.statusMessage = statusMessage;
        res.locals.statusCode = statusCode;
        res.locals.dataObject = dataObject;
        next()
    }
    catch (err) {
        next(err)
    }
}

const updateUserPasswordFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        const token = req.body.token;
        const userId = req.body.userId;
        const oldPassword = req.body.oldPassword;
        const confirmNewPassword = req.body.confirmNewPassword;

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
            audience: 'AuthToken',
            issuer: 'API'
        });

        if (userId == verifyToken.userId) {
            const user = await userMongo.findById(userId);
            if (user) {
                let matchPassword = await bcrypt.compare(oldPassword, user.password);               
                if (matchPassword) {
                    let hashPassword = await bcrypt.hash(confirmNewPassword, 12)
                    user.password = hashPassword
                    user.save();
                    statusCode = 200;
                    statusMessage = "Password updated successfully";
                    dataObject.userInfo = user;
                }
                else {
                    statusCode = 204;
                    statusMessage = "Password does not match";
                    dataObject.errors = {};
                    if (!matchPassword) dataObject.errors.matchPassword = "Password does not match";
                }
            }
            else {
                statusCode = 401;
                statusMessage = "Not authorized";
            }

        }
        else {
            statusCode = 401;
            statusMessage = "Not authorized";
        }


        dataObject.message = statusMessage;
        res.locals.statusCode = statusCode;
        res.locals.dataObject = dataObject;
        res.locals.statusMessage = statusMessage;

        next();
    }
    catch (err) {
        next(err);
    }
};

module.exports = {
    updateUser: updateUserFunction,
    userDashboard: userDashboardFunction,
    userFeedback: userFeedbackFnction,
    updateUserPassword:updateUserPasswordFunction
};