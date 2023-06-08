const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const Schema = mongoose.Schema;
const feedbackSchema = new Schema({
    user: {
       type: Schema.Types.ObjectId,
        ref: 'User'
    },
    feedback: {
        type: String
    },
    totalFeedbck:{
        type: Schema.Types.ObjectId,
        ref:'TotalFeedback'
    }
});

feedbackSchema.plugin(timestamps);

module.exports = mongoose.model('Feedback', feedbackSchema, 'feedbacks');