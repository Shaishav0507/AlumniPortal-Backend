const setupExpressJs = () => {
    const express = require('express');

    const cors = require('cors');

    const helmet = require('helmet');

    const app = express();

    const path = require('path');

    const bodyParser = require('body-parser');

    // const multer = require('multer')();

    const upload = require('../utils/multer-use');

    const routerControls = require('../routes/router');
    
    const rootPathControl = require('../utils/path');

    const mongoConnect = require('./database/mongo');

    const logControls = require('../controllers/log/logController');

    const miscControls = require('../controllers/misc/miscController');

    const miscMiddle = require('../middlewares/miscMiddleware');

    const logMiddle = require('../middlewares/logMiddleware');

    // enable cors
    app.use(cors({
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 200
    }));

    // use helmet - secure headers
    app.use(helmet());

    // set server port
    app.set('port', process.env.PORT);

    // set server hostname
    app.set('hostname', process.env.HOSTNAME);

    // set environment variable
    app.set('env', process.env.NODE_ENV);

    // set environment description
    app.set('env-desc', process.env.NODE_ENV_DESC);

    // start node-server
    mongoConnect.mongoConnect(() => {
        const server = app.listen(app.get('port'), app.get('hostname'), () => {
            const port = server.address().port;
            const address = server.address().address;
            console.log('ExpressJS listening on address ' + address + ' with port ' + port);
            console.log('Env. Details:', app.get('env') + ' - ' + app.get('env-desc'));
        });
    });


    // serve files statically    
    app.use(express.static(path.join(rootPathControl.rootPath, 'public')));
    app.use("/uploads", express.static(path.join(rootPathControl.rootPath, 'uploads')));

    // parsing raw json
    app.use(bodyParser.json());

    // parsing x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // parsing multipart form-data
    // app.use(multer.array());

    // set api response object
    app.use(miscControls.setApiReq);

    // bypass log view routes/actions from being logged
    app.use('/logs', logMiddle.noLoggingThis, routerControls.logRoutes);

    // log request data
    app.use(logControls.requestLogger);


    // common middleware on all requests
    app.use(miscMiddle.commonCheck);

    // execute misc routes
    app.use('/misc', upload.uploadMulter.none(), routerControls.miscRoutes);

    // execute test routes
    app.use('/test', upload.uploadMulter.none(), routerControls.testRoutes);

    // execute auth routes
    app.use('/admin', upload.uploadMulter.none(), routerControls.adminRoutes);

    // execute auth routes
    app.use('/auth', upload.uploadMulter.none(), routerControls.authRoutes);

    // execute user routes
    app.use('/user', routerControls.userRoutes);

    // execute appointment routes
    app.use('/appointment', upload.uploadMulter.none(), routerControls.appointRoutes);

    // execute office routes
    app.use('/office', upload.uploadMulter.none(), routerControls.officeRoutes);

    // execute db routes
    app.use('/db', upload.uploadMulter.none(), logMiddle.noLoggingThis, routerControls.dbRoutes);

    // set 500 error response
    app.use(miscControls.serverError);

    // log response data
    app.use(logControls.responseLogger);

    // return api response object
    app.use(miscControls.setApiRes);

    // set 404 endpoint
    app.use(miscControls.error404);

};

module.exports = {
    setupExpress: setupExpressJs
};