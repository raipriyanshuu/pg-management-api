const express = require('express');
const { getDashboardStats } = require('../controllers/dashboard.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

const router = express.Router();

// Define the route to get the dashboard stats, protected by middleware
router.route('/stats').get(protect, getDashboardStats);

module.exports = router;
