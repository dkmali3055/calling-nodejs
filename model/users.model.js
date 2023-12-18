const mongoose = require('mongoose');
const Joi = require('joi');

// Define the user schema
const userSchema = new mongoose.Schema({
    deviceToken: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: 'https://www.gravatar.com'
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Define the validation schema using Joi
const userValidationSchema = Joi.object({
    deviceToken: Joi.string().required(),
    userName: Joi.string().required(),
    fullName: Joi.string().required(),
    profilePic: Joi.string().allow(''),
    password: Joi.string().required()
});

// Export the user model and validation schema
module.exports = {
    User: mongoose.model('User', userSchema),
    userValidationSchema
};
