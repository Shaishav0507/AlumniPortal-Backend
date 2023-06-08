const osInfoFunction = () => {
    const os = require('os');
    const osInformation = {};
    osInformation.type = os.type();
    osInformation.release = os.release();
    osInformation.platform = os.platform();
    osInformation.arch = os.arch();
    osInformation.hostname = os.hostname();
    osInformation.homedir = os.homedir();
    osInformation.freemem = os.freemem() / 1073741824;
    osInformation.totalmem = os.totalmem() / 1073741824;
    osInformation.userInfo = os.userInfo();
    return osInformation;
};

const openServerUrl = () => {
    const opn = require('opn');
    opn('http://' + process.env.HOSTNAME + ":" + process.env.PORT);
};

const defaultActionsFunction = (action) => {
    switch (action) {
        case 1:
            return osInfoFunction();
            break;

        default:
            console.log("Default Action Value", action);
            break;
    }
};

module.exports = {
    actDefault: defaultActionsFunction
}