const uuidv4 = require('uuid/v4');

const requestLogMongo = require('../../models/schemas/logs/requestLogger');
const responseLogMongo = require('../../models/schemas/logs/responseLogger');

const paginate = require('../../utils/paginate');

const logsPerPage = 10;

const myRequestLoggerFunction = async (req, res, next) => {
    if (req.originalUrl === "/favicon.ico" || req.noLogThis == true) {
        // do nothing
        next();
    } else {
        req.id = uuidv4();

        const logRequest = {
            'uniqueId': req.id,
            'clientIP': req.ip,
            'requestMethod': req.method,
            'requestHeaders': req.headers,
            'requestQueryJSON': req.query,
            'requestParamsJSON': req.params,
            'requestURL': req.protocol + "://" + req.hostname + req.url,
            'requestBodyJSON': req.body,
            'noLogThis': req.noLogThis
        };

        const reqLog = {};
        reqLog.uniqueId = req.id;
        reqLog.bodyContent = logRequest;

        const reqLogObj = new requestLogMongo(reqLog);

        await reqLogObj
            .save()
            .then(requestLogged => {
                req.requestLoggedId = requestLogged._id;
            });
        next();
    }
};

const myResponseLoggerFunction = (req, res, next) => {
    next();
    if (req.originalUrl === "/favicon.ico" || req.noLogThis == true) {
        // do nothing
    } else {
        const logResponse = {
            'uniqueId': req.id,
            'clientIP': req.ip,
            'responseBodyJSON': res.locals,
        };

        const resLog = {};
        resLog.uniqueId = req.id;
        resLog.bodyContent = logResponse;
        resLog.requestLogId = req.requestLoggedId;

        // console.log(resLog);

        const resLogObj = new responseLogMongo(resLog);

        resLogObj
            .save()
            .then(responseLogged => {
                requestLogMongo.findByIdAndUpdate(req.requestLoggedId, {
                    $set: {
                        responseLogId: responseLogged._id
                    }
                }).then().catch(err => {
                    console.log("Error while mapping the response with the request", err);
                });
            });
    }
};

// my log view functions

const logHomeFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Log Response Error";

        let page = parseInt(req.query.page);
        page = page > 0 ? page : 1;
        const skipLogs = (page - 1) * logsPerPage;

        const totalLogs = await requestLogMongo.find().countDocuments()
        const logs = await requestLogMongo.find().skip(skipLogs).limit(logsPerPage).populate('responseLogId');

        dataObject.logData = logs;
        dataObject.pagination = paginate.setPagination(totalLogs, logsPerPage, logs.length, page);
        dataObject.message = "Log Home Response";


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
    requestLogger: myRequestLoggerFunction,
    responseLogger: myResponseLoggerFunction,
    logHome: logHomeFunction
};