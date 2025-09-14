const express = require('express');
// --- NEW: Import loginUser from the controller ---
const { register, loginUser } = require('../controllers/auth.controller.js');

const router = express.Router();

// Route for registering a new PG Owner and User
router.post('/register', register);

// --- NEW: Add the route for logging in a user ---
router.post('/login', loginUser);

module.exports = router;
