const express = require('express');
const {
  createProperty,
  getProperties,
  updateProperty,
  deleteProperty,
} = require('../controllers/property.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

// --- Step 1: Import the new tenant router ---
const tenantRouter = require('./tenant.routes.js');
const router = express.Router();


// --- Step 2: Re-route to the tenant router for nested routes ---
// This line acts like a receptionist. It says: "If the URL continues
// with '/:propertyId/tenants', I'm not going to handle it.
// Instead, I will hand off control to the tenantRouter."
router.use('/:propertyId/tenants', tenantRouter);


// This route handles GETTING all properties and POSTING a new one.
// It applies to the base URL: /api/properties
router.route('/').post(protect, createProperty).get(protect, getProperties);

// This route handles UPDATING and DELETING a *specific* property by its ID.
// It applies to URLs like: /api/properties/60d21b4667d0d8992e610c85
router.route('/:id').put(protect, updateProperty).delete(protect, deleteProperty);

module.exports = router;


