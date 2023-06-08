const get404ErrorFunction = (req, res, next) => {
    res
        .status(404)
        .json({
            'status': 404,
            'data': null,
            'message': 'The api endpoint not found'
        })
        .end();
};

const setApiRequestFunction = (req, res, next) => {
    res.locals.statusCode = 400;
    res.locals.dataObject = null
    res.locals.statusMessage = "Unhandled Service Request";
    next();
};

const setApiResponseFunction = (req, res, next) => {
    res
        .status(200)
        .json({
            'status': res.locals.statusCode,
            'data': res.locals.dataObject,
            'message': res.locals.statusMessage
        })
        .end();
};

const miscHomeFunction = (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        dataObject.testSuccess = true;
        dataObject.message = "Miscellaneous Home Response";

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

const getServerErrorFunction = (error, req, res, next) => {
    let statusCode = 204;
    const dataObject = {};
    let statusMessage = "Internal Server Error";

    dataObject.message = error.message;

    statusCode = 500;
    statusMessage = dataObject.message;

    res.locals.statusCode = statusCode;
    res.locals.dataObject = dataObject;
    res.locals.statusMessage = statusMessage;
    next();
};

module.exports = {
    error404: get404ErrorFunction,
    setApiReq: setApiRequestFunction,
    setApiRes: setApiResponseFunction,
    miscHome: miscHomeFunction,
    serverError: getServerErrorFunction
};