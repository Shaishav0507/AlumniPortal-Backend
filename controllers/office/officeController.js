const officeMongo = require('../../models/schemas/misc/office');

const createNewLocationFunction = (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";
        
        const location = req.body.location;

        const newOfficeInfo = {};
        newOfficeInfo.location = location;

        const newOfficeObj = new officeMongo(newOfficeInfo);
        newOfficeObj.save();

        statusCode = 200;
        statusMessage = "New Office location created successfully";

        dataObject.newLocation = newOfficeObj;
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

const listOfficesFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        const officeLocations = await officeMongo.find();

        statusCode = 200;
        statusMessage = "Office locations";

        dataObject.locations = officeLocations;
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
    createNewLocation: createNewLocationFunction,
    listOffices: listOfficesFunction
};