const testHomeFunction = (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        dataObject.testSuccess = true;
        dataObject.message = "Test Home Response";

        statusCode = 200;
        statusMessage = dataObject.message;

        res.locals.statusCode = statusCode;
        res.locals.dataObject = dataObject;
        res.locals.statusMessage = statusMessage;

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    testHome: testHomeFunction
};