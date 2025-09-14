const Payment = require('../models/payment.model.js');
const Tenant = require('../models/tenant.model.js');

/**
 * @desc    Record a new payment for a tenant
 * @route   POST /api/properties/:propertyId/tenants/:tenantId/payments
 * @access  Private
 */
const createPayment = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { amount, paymentDate, paymentMethod } = req.body;

    // --- SECURITY CHECK: Find the tenant and verify ownership ---
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    if (tenant.pgOwner.toString() !== req.user.pgOwner.toString()) {
      return res.status(401).json({ message: 'User not authorized for this tenant' });
    }

    // --- BUSINESS LOGIC PART 1: Create the payment record ---
    const payment = await Payment.create({
      amount,
      paymentDate,
      paymentMethod,
      tenant: tenantId,
      property: tenant.property, // Get property from the tenant record
      pgOwner: req.user.pgOwner,  // Get owner from the logged-in user
    });

    // --- BUSINESS LOGIC PART 2: Update the tenant's status ---
    tenant.paymentStatus = 'Paid';
    await tenant.save();

    res.status(201).json({
      message: 'Payment recorded and tenant status updated successfully',
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get all payments for a specific tenant
 * @route   GET /api/properties/:propertyId/tenants/:tenantId/payments
 * @access  Private
 */
const getPaymentsForTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // --- SECURITY CHECK: Find the tenant and verify ownership ---
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    if (tenant.pgOwner.toString() !== req.user.pgOwner.toString()) {
      return res.status(401).json({ message: 'User not authorized for this tenant' });
    }

    // Now that we're secure, find all payments linked to this tenant
    const payments = await Payment.find({ tenant: tenantId }).sort({ paymentDate: -1 }); // Sort by newest first

    res.status(200).json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  createPayment,
  getPaymentsForTenant,
};
