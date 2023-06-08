const jwt = require('jsonwebtoken');

const userMongo = require('../../models/schemas/auth/user');

const appointMongo = require('../../models/schemas/appointment/appointment');

const crypto = require('crypto');

const brcypt = require('bcryptjs');

const adminMongo = require('../../models/schemas/admin/admin');

const sendGridMailer = require('../../utils/mail/sendgrid');

const utilities = require('../../utils/utilities');

const listPatientsFunction = async (req, res, next) => {
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

            if (user && user.role == 3) {
                const allPatients = await userMongo.find({ role: 1 }).select("-password");

                dataObject.patients = allPatients;
                statusCode = 200;
                statusMessage = "All Patients Information";
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

const listDoctorsFunction = async (req, res, next) => {
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

            if (user && user.role == 3) {
                const allDoctors = await userMongo.find({ role: 2 }).select("-password").populate("location");

                dataObject.doctors = allDoctors;
                statusCode = 200;
                statusMessage = "All Doctors Information";
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

const listAppointmentFunction = async (req, res, next) => {
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

            if (user && user.role == 3) {
                const allAppointments = await appointMongo.find().populate("userId docUserId type location", "-password");

                dataObject.appointments = allAppointments;
                statusCode = 200;
                statusMessage = "All Appointments Information";
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

const updateDoctorFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        const token = req.body.userToken;
        const userId = req.body.userId;

        const docId = req.body.docId;
        const active = req.body.active;

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
            audience: 'AuthToken',
            issuer: 'API'
        });

        if (userId == verifyToken.userId) {
            const user = await userMongo.findById(userId).select("-password");

            if (user && user.role == 3) {
                const doctor = await userMongo.findById(docId).select("-password");
                doctor.active = active;
                doctor.save();

                dataObject.doctor = doctor;
                statusCode = 200;
                statusMessage = active ? "Doctor marked as approved" : "Doctor marked as not approved";
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

const postSignUpFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        const address = req.body.address;
        const phoneNumber = req.body.phoneNumber;
        const profilePic = req.body.profilePic;
        if (firstName && lastName && email && password && confirmPassword && address && phone && profilePic) {
            const user = await adminMongo.findOne({ email: email });
            if (user) {
                statusCode = 204;
                statusMessage = "Account with this email address already exists";
                dataObject.errors = {};
                dataObject.errors.email = "Account with this email address already exist";
            }
            else {
                // password = utilities.decrypt(password);
                // confirmPassword = utilities.decrypt(confirmPassword);
                if (password === confirmPassword) {
                    const hashedPassword = await brcypt.hash(password, 12);

                    const userInfo = {};
                    userInfo.firstName = firstName;
                    userInfo.lastName = lastName;
                    userInfo.email = email;
                    userInfo.password = hashedPassword;
                    userInfo.address = address;
                    userInfo.phoneNumber = phoneNumber;
                    userInfo.profilePic = profilePic;

                    const userObj = new adminMongo(userInfo);
                    const user = await userObj.save();
                    if (!user) {
                        statusCode = 204;
                        statusMessage = "Unable to signup, try after some time";
                        dataObject.errors = {};
                        dataObject.errors.user = "Unable to signup, try after some time";
                    }
                    else {
                        const jwtObject = {};
                        jwtObject.email = email;
                        jwtObject.userId = user._id.toString();

                        const tokenJwt = jwt.sign(jwtObject, process.env.JWT_SECRET_KEY, {
                            audience: 'AuthToken',
                            issuer: 'API',
                            expiresIn: '4h'
                        });
                        statusCode = 200;
                        statusMessage = "Admin registered successfully";
                        const userInfo = { ...user.toObject(), password: undefined };
                        dataObject.userInfo = userInfo;
                        dataObject.userToken = tokenJwt;
                    }
                }
                else {
                    statusCode = 204;
                    statusMessage = "Passwords do not match";
                    dataObject.errors = {};
                    dataObject.errors.password = "Password does not match";
                    dataObject.errors.confirmPassword = "Password does not match";
                }
            }
        }
        else {
            statusCode = 204;
            statusMessage = "Not each required information present";
            dataObject.errors = {};
            if (!email) dataObject.errors.email = "Please provide your email address";
            if (!password) dataObject.errors.password = "Please enter the password for your account";
            if (!confirmPassword) dataObject.errors.confirmPassword = "Please confirm the password for your account";
            if (!firstName) dataObject.errors.firstName = "Please provide first Name";
            if (!lastName) dataObject.errors.lastName = "Please provide last Name";
            if (!address) dataObject.errors.address = "Please provide address";
            if (!phoneNumber) dataObject.errors.phoneNumber = "Please provide phone Number";
            if (!profilePic) dataObject.errors.profilePic = "Please provide profile image link";
        }

        dataObject.message = statusMessage;
        res.locals.statusCode = statusCode;
        res.locals.dataObject = dataObject;
        res.locals.statusMessage = statusMessage;

        next();
    } catch (err) {
        next(err);
    }
};


module.exports = {
    listPatients: listPatientsFunction,
    listDoctors: listDoctorsFunction,
    listAppointment: listAppointmentFunction,
    updateDoctor: updateDoctorFunction,
    postAdminSignUp: postSignUpFunction
};