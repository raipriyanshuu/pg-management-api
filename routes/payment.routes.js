const express = require('express');
const {
  createPayment,
  getPaymentsForTenant,
} = require('../controllers/payment.controller.js');
const { protect } = require('../middleware/auth.middleware.js');

// { mergeParams: true } is essential for accessing :tenantId from the parent router
const router = express.Router({ mergeParams: true });

// These routes correspond to the URL:
// /api/properties/:propertyId/tenants/:tenantId/payments
router
  .route('/')
  .post(protect, createPayment)
  .get(protect, getPaymentsForTenant);

module.exports = router;
