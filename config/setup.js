const dotEnv = require('custom-env');

// dev env file
dotEnv.env();

const express = require('./express');

module.exports = {
    express: express
};