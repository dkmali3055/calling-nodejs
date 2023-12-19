const mongoose = require('mongoose');
const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/VideoSDK';
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
};

module.exports = connectToMongoDB;
