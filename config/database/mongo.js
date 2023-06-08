const mongoose = require('mongoose');

// mongodb connection uri
const mongoUri = process.env.CONNECTION_STRING;
let _db;

const mongoConnection = callback => {
    mongoose
        .connect(mongoUri, {
            useNewUrlParser: true
        })
        .then(client => {
            console.log('Connected to Mongo Database');
            _db = client;
            callback(client);
        })
        .catch(err => {
            console.log(err);
        });
};

const mongoClientFunction = () => {
    return _db;
};

module.exports = {
    mongoConnect: mongoConnection,
    mongoClient: mongoClientFunction
};