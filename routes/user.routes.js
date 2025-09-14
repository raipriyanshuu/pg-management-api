const express = require('express');
const { getUserProfile } = require('../controllers/user.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

const router = express.Router();

// Here is where the magic happens.
// We add the 'protect' middleware as the second argument.
// The request will go through protect() first, and ONLY if it calls next(),
// will it proceed to getUserProfile().
router.get('/profile', protect, getUserProfile);

module.exports = router;
