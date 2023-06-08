const mongoose = require('mongoose');

const timestamps = require('mongoose-timestamp');

const Schema = mongoose.Schema;

const officeSchema = new Schema({
    location: {
        type: String,
        required: true
    }
});

officeSchema.plugin(timestamps);

module.exports = mongoose.model('Office', officeSchema, 'offices');