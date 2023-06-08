const jwt = require('jsonwebtoken');

const userMongo = require('../../models/schemas/auth/user');

const appointMongo = require('../../models/schemas/appointment/appointment');

const typeAppointMongo = require('../../models/schemas/appointment/types');

const bookAppointmentFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        const token = req.body.userToken;
        const userId = req.body.userId;

        const appointment = req.body.appointment;
        const office = req.body.office;
        const doctor = req.body.doctor;
        const date = req.body.date;
        const time = req.body.time;
        const durationBooked = req.body.durationBooked;

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
            audience: 'AuthToken',
            issuer: 'API'
        });

        if (userId == verifyToken.userId) {
            const user = await userMongo.findById(userId).select("-password");

            if (user) {
                if (appointment && office && doctor && date && time) {

                    const appointInfo = {};
                    appointInfo.type = appointment;
                    appointInfo.userId = userId;
                    appointInfo.docUserId = doctor;
                    appointInfo.location = office;
                    appointInfo.status = 1;
                    appointInfo.durationBooked = durationBooked;
                    appointInfo.attendance = false;
                    appointInfo.date = new Date(date);
                    appointInfo.time = new Date(date + " " + time);

                    const appointObj = new appointMongo(appointInfo);
                    appointObj.save();

                    statusCode = 200;
                    statusMessage = "Appointment booked successfully";
                    dataObject.userInfo = user;
                    dataObject.appointmentInfo = appointInfo;
                }
                else {
                    statusCode = 204;
                    statusMessage = "Not each required information present";
                    dataObject.errors = {};
                    if (!appointment) dataObject.errors.appointment = "Please select the appointment type";
                    if (!office) dataObject.errors.office = "Please select the location";
                    if (!doctor) dataObject.errors.doctor = "Please select the doctor";
                    if (!date) dataObject.errors.date = "Please select the appointment date";
                    if (!time) dataObject.errors.time = "Please select the appointment time";
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

const checkBookAppointmentFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        const token = req.body.userToken;
        const userId = req.body.userId;

        const appointment = req.body.appointment;
        const office = req.body.office;
        const date = req.body.date;
        const time = req.body.time;
        const durationBooked = req.body.durationBooked;

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
            audience: 'AuthToken',
            issuer: 'API'
        });

        if (userId == verifyToken.userId) {
            const user = await userMongo.findById(userId).select("-password");

            if (user) {
                if (appointment && office && date && time) {

                    const doctorsList = await userMongo.find({location: office, role: 2, active: true}).select("_id email status contactNumber firstName lastName location").populate("location");

                    statusCode = doctorsList.length > 0 ? 200 : 204;
                    statusMessage = doctorsList.length > 0 ? "Available doctors on the location" : "No doctors are available on the location";
                    dataObject.userInfo = user;
                    dataObject.doctorsList = doctorsList;
                }
                else {
                    statusCode = 204;
                    statusMessage = "Not each required information present";
                    dataObject.errors = {};
                    if (!appointment) dataObject.errors.appointment = "Please select the appointment type";
                    if (!office) dataObject.errors.office = "Please select the location";
                    if (!date) dataObject.errors.date = "Please select the appointment date";
                    if (!time) dataObject.errors.time = "Please select the appointment time";
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

const createNewTypeFunction = (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";
        
        const name = req.body.name;

        const newTypeInfo = {};
        newTypeInfo.name = name;

        const newTypeObj = new typeAppointMongo(newTypeInfo);
        newTypeObj.save();

        statusCode = 200;
        statusMessage = "New Appointment Type created successfully";

        dataObject.newType = newTypeObj;
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

const listAppointmentTypesFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        const appointmentTypes = await typeAppointMongo.find();

        statusCode = 200;
        statusMessage = "Appointment Types";

        dataObject.appointmentTypes = appointmentTypes;
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

const updateAppointmentFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        const token = req.body.userToken;
        const userId = req.body.userId;

        const appointmentId = req.body.appointmentId;
        const status = req.body.status;
        const attendance = req.body.attendance;

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET_KEY, {
            audience: 'AuthToken',
            issuer: 'API'
        });

        if (userId == verifyToken.userId) {
            const user = await userMongo.findById(userId).select("-password");

            if (user) {
                if (appointmentId && status) {

                    const appointInfo = await appointMongo.findById(appointmentId);
                    
                    appointInfo.status = status;
                    appointInfo.attendance = attendance;

                    appointInfo.save();

                    statusCode = 200;
                    statusMessage = "Appointment updated successfully";
                    dataObject.userInfo = user;
                    dataObject.appointmentInfo = appointInfo;
                }
                else {
                    statusCode = 204;
                    statusMessage = "Not each required information present";
                    dataObject.errors = {};
                    if (!appointmentId) dataObject.errors.appointment = "Please select the appointment to update";
                    if (!status) dataObject.errors.status = "Please update the status";
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
    bookAppointment: bookAppointmentFunction,
    checkBookAppointment: checkBookAppointmentFunction,
    updateAppointment: updateAppointmentFunction,
    createNewType: createNewTypeFunction,
    listAppointmentTypes: listAppointmentTypesFunction
};