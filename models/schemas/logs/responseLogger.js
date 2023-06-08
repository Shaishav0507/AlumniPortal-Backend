const mongoose = require('mongoose');

const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const responseSchema = new Schema({
    bodyContent: {
        type: Schema.Types.Mixed,
        required: false
    },
    uniqueId: {
        type: String,
        required: true
    },
    requestLogId: {
        type: Schema.Types.ObjectId,
        ref: 'Request'
    }
});

responseSchema.plugin(timestamps);

module.exports = mongoose.model('Response', responseSchema, 'responses');
