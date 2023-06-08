const miscRouter = require('./router.misc');
const testRouter = require('./routes.test');
const logRouter = require('./router.log');
const authRouter = require('./router.auth');
const userRouter = require('./router.user');
const adminRouter = require('./router.admin');
const dbRouter = require('./router.db');
const appointRouter = require('./router.appoint');
const officeRouter = require('./router.office');

module.exports = {
    miscRoutes: miscRouter,
    testRoutes: testRouter,
    logRoutes: logRouter,
    authRoutes: authRouter,
    userRoutes: userRouter,
    adminRoutes: adminRouter,
    dbRoutes: dbRouter,
    appointRoutes: appointRouter,
    officeRoutes: officeRouter
};