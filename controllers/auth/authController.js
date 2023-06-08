const crypto = require('crypto');

const brcypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const userMongo = require('../../models/schemas/auth/user');

const sendGridMailer = require('../../utils/mail/sendgrid');

const utilities = require('../../utils/utilities');

const postSignUpFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";
        const email = req.body.email;
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        let userId = (req.body.userId).toLowerCase();
        if (email && password && confirmPassword && userId) {
            const user = await userMongo.findOne({ email: email });
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
                    userInfo.email = email;
                    userInfo.password = hashedPassword;
                    userInfo.userId = userId;

                    const userObj = new userMongo(userInfo);
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
                        statusMessage = "User registered successfully";
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
            if (!userId) dataObject.errors.role = "Please provide the user userId";
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

const postLoginFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        let userId = (req.body.userId).toLowerCase();
        let password = req.body.password;
        // console.log("1234", userMongo);
        const user = await userMongo.findOne({ userId: userId }).populate('feedbackLogs');
        // console.log("Hello", user);
        if (!user) {
            statusCode = 204;
            statusMessage = "No such user account found";
            dataObject.errors = {};
            dataObject.errors.userId = "Account with this userId does not exist";
        }
        else {
            // password = utilities.decrypt(password);
            const passMatch = await brcypt.compare(password, user.password);
            if (!passMatch) {
                statusCode = 204;
                statusMessage = "Invalid login credential for the user account";
                dataObject.errors = {};
                dataObject.errors.password = "Invalid password for this user account";
            }
            else {
                const jwtObject = {};
                jwtObject.userId = userId;
                jwtObject.userId = user._id.toString();
                const tokenJwt = jwt.sign(jwtObject, process.env.JWT_SECRET_KEY, {
                    audience: 'AuthToken',
                    issuer: 'API',
                    expiresIn: '4h'
                });
                statusCode = 200;
                statusMessage = "Logged In Successfully";
                const userInfo = { ...user.toObject(), password: undefined };
                dataObject.userInfo = userInfo;
                dataObject.userToken = tokenJwt;
            }
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

const genResetFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                throw Error('Unable to process the reset request, try after some time');
            }
            else {
                try {
                    const email = req.body.email;
                    const user = await userMongo.findOne({ email: email });
                    if (!user) {
                        statusCode = 204;
                        statusMessage = "No such user account found";
                        dataObject.errors = {};
                        dataObject.errors.user = "Account with this email address does not exist";
                    }
                    else {
                        const token = buffer.toString('hex');
                        user.tokenReset = token;
                        user.tokenResetExpiry = Date.now() + 3600000;
                        await user.save();

                        statusCode = 200;
                        statusMessage = "Password Reset mail sent successfully";
                        let resetUrl = req.protocol + "://";
                        resetUrl += process.env.HOSTNAME + ":" + process.env.PORT + "/patient/reset-password/" + token;
                        resetUrl = "http://localhost:3000/patient/reset-password/" + token;
                        const mailObject = {};
                        mailObject.to = req.body.email;
                        mailObject.from = process.env.SENDMAIL_ID;
                        mailObject.subject = 'Reset Password - Node API';
                        mailObject.html = `
                        <p>You requested a password reset</p>
                        <p>Cick this <a href = ${resetUrl} target = '_blank'>link</a> to reset your password</p>
                        <br />
                        <p>Link valid only for an hour</p>
                        `;
                        sendGridMailer.sendMailer(mailObject);
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
            }
        });
    }
    catch (err) {
        next(err);
    }
};

const getResetFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        dataObject.allowReset = false;

        const token = req.body.token;

        const user = await userMongo.findOne({
            tokenReset: token,
            tokenResetExpiry: {
                $gt: Date.now()
            }
        });
        if (!user) {
            statusCode = 204;
            statusMessage = "Expired/Invalid Reset Token";
            dataObject.errors = {};
            dataObject.errors.token = "Expired/Invalid Reset Token";
        }
        else {
            statusCode = 200;
            const userInfo = { ...user.toObject(), password: undefined };
            dataObject.userInfo = userInfo;
            dataObject.allowReset = true;
            statusMessage = "Allow password reset";
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

const postPassResetFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        const token = req.body.token;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        const user = await userMongo.findOne({
            tokenReset: token,
            tokenResetExpiry: {
                $gt: Date.now()
            }
        });
        if (!user) {
            statusCode = 204;
            statusMessage = "Expired/Invalid Reset Token";
            dataObject.errors = {};
            dataObject.errors.token = "Expired/Invalid Reset Token";
        }
        else {
            if (password === confirmPassword) {
                const hashedPassword = await brcypt.hash(password, 12);
                user.password = hashedPassword;
                user.tokenReset = undefined;
                user.tokenResetExpiry = undefined;
                user.save();

                statusCode = 200;
                statusMessage = "Password changed successfully";

                const jwtObject = {};
                jwtObject.email = user.email;
                jwtObject.userId = user._id.toString();

                const tokenJwt = jwt.sign(jwtObject, process.env.JWT_SECRET_KEY, {
                    audience: 'AuthToken',
                    issuer: 'API',
                    expiresIn: '4h'
                });

                const userInfo = { ...user.toObject(), password: undefined };

                dataObject.userInfo = userInfo;
                dataObject.userToken = tokenJwt;
            }
            else {
                statusCode = 204;
                statusMessage = "Passwords do not match";
                dataObject.errors = {};
                dataObject.errors.password = "Password does not match";
                dataObject.errors.confirmPassword = "Password does not match";
            }
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

const verifyAuthTokenFunction = async (req, res, next) => {
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
                statusCode = 200;
                statusMessage = "Auth Token verified successfully";
                dataObject.userInfo = user;
            }
            else {
                statusCode = 204;
                statusMessage = "User not registered";
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
    postSignup: postSignUpFunction,
    postLogin: postLoginFunction,
    genReset: genResetFunction,
    getReset: getResetFunction,
    resetPass: postPassResetFunction,
    verifyAuthToken: verifyAuthTokenFunction
};