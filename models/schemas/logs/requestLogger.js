const mongoose = require('mongoose');

const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const requestSchema = new Schema({
    bodyContent: {
        type: Schema.Types.Mixed,
        required: false
    },
    uniqueId: {
        type: String,
        required: true
    },
    responseLogId: {
        type: Schema.Types.ObjectId,
        ref: 'Response'
    }
});

requestSchema.plugin(timestamps);

module.exports = mongoose.model('Request', requestSchema, 'requests');