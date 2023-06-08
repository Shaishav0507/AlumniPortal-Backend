const mongoose = require('mongoose');

const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    birthDate: {
        type: Date,
        required: false
    },
    contactNumber: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        required: false
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
    role: {
        type: Number,
        required: false
    },
    tokenReset: {
        type: String
    },
    tokenResetExpiry: {
        type: Date
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    feedbackLogs: {
        type: Schema.Types.ObjectId,
        ref: 'Feedback'
    }
});

userSchema.plugin(timestamps);

module.exports = mongoose.model('User', userSchema, 'users');