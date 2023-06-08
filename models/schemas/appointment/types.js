const mongoose = require('mongoose');

const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const typeAppointmentSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

typeAppointmentSchema.plugin(timestamps);

module.exports = mongoose.model('TypeAppointment', typeAppointmentSchema, 'type_appointment');