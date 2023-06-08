const mongoose = require('mongoose');
const timeStamp = require('mongoose-timestamp');
const Schema = mongoose.Schema;
const totalFeedbackSchema = new Schema({
    total: {
        type: Number
    },
    greatFeedback: {
        type: Number
    },
    badFeedback: {
        type: Number
    },
    goodFeedback: {
        type: Number
    },
    feedback: {
        type: String
    },
    users: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
totalFeedbackSchema.plugin(timeStamp);
module.exports = mongoose.model("TotalFeedback", totalFeedbackSchema, 'totalfeedbacks')