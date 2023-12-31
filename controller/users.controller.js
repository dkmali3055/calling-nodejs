const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {User} = require('../model/users.model'); 
const { successResponse, errorResponse } = require('../utils/response.util');
const { Message } = require('../utils/constant');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

//register function controller
async function register(req, res) {
    const { deviceToken, userName, fullName, profilePic,password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return successResponse(req, res, 400, Message.USER_ALREADY_EXISTS, null);
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            deviceToken,
            userName,
            fullName,
            profilePic,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ userId: newUser._id,userName }, JWT_SECRET_KEY);

        let response = {
            _id: newUser._id,
            deviceToken: newUser.deviceToken,
            userName: newUser.userName,
            fullName: newUser.fullName,
            profilePic: newUser.profilePic,
            token: token    
        }
        // Return the token and user details
        return successResponse(req, res, 200, Message.REGISTER_SUCCESS, response);
    } catch (error) {
        return errorResponse(req, res,500,{message : error.message,stack : error.stack});
    }
}

//login function controller

async function login(req, res) {
    
    try {
        const { userName, password } = req.body;
        // Check if the user exists
        const user = await User.findOne({ userName });
        if (!user) {
            return successResponse(req, res, 404, Message.USER_NOT_FOUND, null);
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return successResponse(req, res, 400, Message.INVALID_PASSWORD, null);
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, userName }, JWT_SECRET_KEY);

        let response = {
            _id: user._id,
            deviceToken: user.deviceToken,
            userName: user.userName,
            fullName: user.fullName,
            profilePic: user.profilePic,
            token: token    
        }
        // Return the token and user details
        return successResponse(req, res, 200, Message.LOGIN_SUCCESS, response);
    } catch (error) {
        console.error(error);
        return errorResponse(req, res,500,{message : error.message,stack : error.stack});
    }
}

// get profile data function controller

async function getProfileData(req, res) {
    
    try {
        const { userId } = req.user; // Get the userId from the request object
        // Find the user by their ID
        const user = await User.findById(userId, { password: 0 });
        if (!user) {
            return successResponse(req, res, 404, Message.USER_NOT_FOUND, null);
        }

        // Return the user's profile data
        return successResponse(req, res, 200, Message.PROFILE_DATA, user);
    } catch (error) {
        return errorResponse(req, res,500,{message : error.message,stack : error.stack});
    }
}

// logout function controller

async function logout(req, res) {   
    return successResponse(req, res, 200, Message.LOGOUT_SUCCESS, null);
}

async function getUserList(req, res) {
    try {
        const { userId } = req.user;
        const userList = await User.find({ _id: { $ne: userId } }, { password: 0 });
        return successResponse(req, res, 200, Message.USER_LIST, userList);
    } catch (error) {
        return errorResponse(req, res,500,{message : error.message,stack : error.stack});
    }
}


module.exports = {
    register,
    login,
    getProfileData,
    logout,
    getUserList
};
