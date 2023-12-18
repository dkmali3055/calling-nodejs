const express = require('express');
const router = express.Router();
const callController = require('../controller/call.controller');
const authMiddleware = require('../middleware/auth');
// Route to get tokens
router.get('/tokens', authMiddleware, callController.getTokens);

// Export the router
module.exports = router;
