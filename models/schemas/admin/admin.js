const mongoose = require('mongoose');

const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    
    profilePic: {
        type: String,
        required: true
    },
    feedbackLogs: {
        type: Schema.Types.ObjectId,
        ref: 'Feedback'
    }
});

adminSchema.plugin(timestamps);

module.exports = mongoose.model('Admin', adminSchema, 'admins');