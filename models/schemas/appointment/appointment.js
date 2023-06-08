const mongoose = require('mongoose');

const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    type: {
        type: Schema.Types.ObjectId,
        ref: 'TypeAppointment',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    docUserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'Office',
        required: true
    },
    status: {
        type: Number,
        required: true
    },
    durationBooked: {
        type: Number,
        required: true
    },
    durationAttended: {
        type: Number
    },
    attendance: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    }
});

appointmentSchema.plugin(timestamps);

module.exports = mongoose.model('Appointment', appointmentSchema, 'appointments');