const noLoggingThisFunction = (req, res, next) => {
    req.noLogThis = true;
    next();
};

module.exports = {
    noLoggingThis: noLoggingThisFunction
};