const mongoClient = require('../../config/database/mongo');

const dbDropDatabaseFunction = async (req, res, next) => {
    try {
        let statusCode = 204;
        const dataObject = {};
        let statusMessage = "Undefined Response Error";

        const clientMongo = mongoClient.mongoClient();

        dataObject.mongoClient = await clientMongo.connection.db.dropDatabase();
        dataObject.message = "Database dropped successfully";

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
    dbDrop: dbDropDatabaseFunction
};