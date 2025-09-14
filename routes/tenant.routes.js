const express = require('express');
const {
  addTenant,
  getTenantsForProperty,
   getTenantById,
  updateTenant,
  deleteTenant,
} = require('../controllers/tenant.controller.js');
const { protect } = require('../middleware/auth.middleware.js');


// Import the payment router to maintain the nested structure
const paymentRouter = require('./payment.routes.js');
// The { mergeParams: true } option is crucial for nested routers.
// It allows this router to access URL parameters from its parent router (e.g., :propertyId)
const router = express.Router({ mergeParams: true });

// This line forwards requests for payments to the paymentRouter
router.use('/:tenantId/payments', paymentRouter);

// Routes for the base /api/properties/:propertyId/tenants URL
router.route('/')
  .post(protect, addTenant)
  .get(protect, getTenantsForProperty);

// Routes for URLs targeting a specific tenant
// e.g., /api/properties/:propertyId/tenants/:tenantId
router.route('/:tenantId')
   .get(protect, getTenantById) // <-- This is the new line you needed
  .put(protect, updateTenant)
  .delete(protect, deleteTenant);

module.exports = router;
