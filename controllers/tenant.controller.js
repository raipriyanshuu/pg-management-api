const Tenant = require('../models/tenant.model.js');
const Property = require('../models/property.model.js');

/**
 * @desc    Add a new tenant to a specific property
 * @route   POST /api/properties/:propertyId/tenants
 * @access  Private
 */
const addTenant = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // --- SECURITY CHECK 1: Check if the property exists and belongs to the user ---
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (property.pgOwner.toString() !== req.user.pgOwner.toString()) {
      return res.status(401).json({ message: 'User not authorized for this property' });
    }

    // Now that we're secure, get the tenant details from the body
    const {
      name,
      gender,
      rentAmount,
      roomNumber,
      paymentStatus,
      mobileNumber,
      whatsappNumber,
    } = req.body;

    const tenant = await Tenant.create({
      name,
      gender,
      rentAmount,
      roomNumber,
      paymentStatus,
      mobileNumber,
      whatsappNumber,
      property: propertyId,      // Link to the specific property
      pgOwner: req.user.pgOwner, // Link to the logged-in PGOwner
    });

    res.status(201).json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get all tenants for a specific property
 * @route   GET /api/properties/:propertyId/tenants
 * @access  Private
 */
const getTenantsForProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // --- SECURITY CHECK 2: Same check as above ---
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (property.pgOwner.toString() !== req.user.pgOwner.toString()) {
      return res.status(401).json({ message: 'User not authorized for this property' });
    }

    // Find all tenants that are linked to this specific property
    const tenants = await Tenant.find({ property: propertyId });

    res.status(200).json(tenants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// --- NEW FUNCTION TO GET A SINGLE TENANT ---
/**
 * @desc    Get a single tenant by their ID
 * @route   GET /api/properties/:propertyId/tenants/:tenantId
 * @access  Private
 */
const getTenantById = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // --- SECURITY CHECK: Verify the logged-in user owns this tenant ---
    if (tenant.pgOwner.toString() !== req.user.pgOwner.toString()) {
      return res.status(401).json({ message: 'User not authorized for this tenant' });
    }

    res.status(200).json(tenant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
// --- END OF NEW FUNCTION ---

/**
 * @desc    Update a specific tenant's details
 * @route   PUT /api/properties/:propertyId/tenants/:tenantId
 * @access  Private
 */
const updateTenant = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const tenant = await Tenant.findById(tenantId);

        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        // --- SECURITY CHECK 3: The most direct check ---
        // Ensure the tenant being updated belongs to the logged-in user
        if (tenant.pgOwner.toString() !== req.user.pgOwner.toString()) {
            return res.status(401).json({ message: 'User not authorized to update this tenant' });
        }

        // Update fields with new data from req.body, or keep the old data if not provided
        tenant.name = req.body.name || tenant.name;
        tenant.gender = req.body.gender || tenant.gender;
        tenant.rentAmount = req.body.rentAmount || tenant.rentAmount;
        tenant.roomNumber = req.body.roomNumber || tenant.roomNumber;
        tenant.paymentStatus = req.body.paymentStatus || tenant.paymentStatus;
        tenant.mobileNumber = req.body.mobileNumber || tenant.mobileNumber;
        tenant.whatsappNumber = req.body.whatsappNumber || tenant.whatsappNumber;
        
        const updatedTenant = await tenant.save();
        res.status(200).json(updatedTenant);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a tenant's record
 * @route   DELETE /api/properties/:propertyId/tenants/:tenantId
 * @access  Private
 */
const deleteTenant = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const tenant = await Tenant.findById(tenantId);

        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        // --- SECURITY CHECK 4: Same check as update ---
        if (tenant.pgOwner.toString() !== req.user.pgOwner.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this tenant' });
        }

        await tenant.deleteOne();
        res.status(200).json({ message: 'Tenant record removed successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = {
  addTenant,
  getTenantsForProperty,
  getTenantById,
  updateTenant,
  deleteTenant
};
