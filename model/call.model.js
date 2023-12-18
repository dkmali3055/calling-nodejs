const mongoose = require('mongoose');
const Joi = require('joi');

const callSchema = new mongoose.Schema({
    caller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['audio', 'video'],
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    }
});

const Call = mongoose.model('Call', callSchema);

const callValidationSchema = Joi.object({
    caller: Joi.string().required(),
    receiver: Joi.string().required(),
    type: Joi.string().valid('audio', 'video').required(),
    startTime: Joi.date().default(Date.now),
    endTime: Joi.date()
});

module.exports = {
    Call,
    callValidationSchema
};
