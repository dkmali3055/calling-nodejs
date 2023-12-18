const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {User} = require('../model/users.model'); // Assuming you have a User model defined
const jwt_SECRET_KEY = process.env.JWT_SECRET_KEY;

//register function controller
async function register(req, res) {
    const { deviceToken, userName, fullName, profilePic,password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
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
        const token = jwt.sign({ userId: newUser._id,userName }, jwt_SECRET_KEY);

        delete newUser._doc.password;
        // Return the token and user details
        res.json({ token, user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//login function controller

async function login(req, res) {
    const { userName, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, userName }, jwt_SECRET_KEY);

        // Return the token and user details
        res.json({ token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// get profile data function controller

async function getProfileData(req, res) {
    const { userId } = req.user; // Assuming you have middleware to extract the user from the JWT token

    try {
        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        delete user._doc.password;
        // Return the user's profile data
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// logout function controller

async function logout(req, res) {   
    return res.status(200).json({ message: 'Logout successfully' });
}


module.exports = {
    register,
    login,
    getProfileData,
    logout
};
