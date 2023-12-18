const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const userController = require('../controller/users.controller');

// Login route
router.post('/login', userController.login);

// Logout route
router.get('/logout',authMiddleware, userController.logout);

// Register route
router.post('/register', userController.register);

// // Send friend request route
// router.post('/send-friend-request',authMiddleware, userController.sendFriendRequest);

// // Accept friend request route
// router.post('/accept-friend-request',authMiddleware, userController.acceptFriendRequest);

// // Get conversation list route
// router.get('/conversation-list',authMiddleware, userController.getConversationList);

// Get profile data route
router.get('/profile-data',authMiddleware, userController.getProfileData);

// // Update profile data route
// router.put('/update-profile-data',authMiddleware, userController.updateProfileData);

// // Update profile picture route
// router.put('/update-profile-pic',authMiddleware, userController.updateProfilePic);

// // Get friend requests route
// router.get('/friend-requests',authMiddleware, userController.getFriendRequests);

// // Get friends route
// router.get('/friends',authMiddleware, userController.getFriends);

//exports the router

module.exports = router;
