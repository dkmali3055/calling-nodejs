const mongoose = require('mongoose');
const Joi = require('joi');
const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'file'],
        default: 'text'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Chat = mongoose.model('Chat', chatSchema);

function validateChat(chat) {
    const schema = Joi.object({
        sender: Joi.string().required(),
        receiver: Joi.string().required(),
        message: Joi.string().required(),
        type: Joi.string().valid('text', 'image', 'video', 'audio', 'file').default('text'),
        timestamp: Joi.date().default(Date.now)
    });

    return schema.validate(chat);
}

module.exports = {
    Chat,
    validateChat
};



