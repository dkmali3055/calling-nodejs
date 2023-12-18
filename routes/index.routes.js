//import express from 'express';
const express = require('express');
const router = express.Router();


// Import all routes
const userRoutes = require('./user.routes');
const callRoutes = require('./call.routes');

router.use('/users', userRoutes);
router.use('/call', callRoutes);

// Export all routes
module.exports = router;
