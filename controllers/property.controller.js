const Property = require('../models/property.model.js');

/**
 * @desc    Create a new property for the logged-in user
 * @route   POST /api/properties
 * @access  Private
 */
const createProperty = async (req, res) => {
  try {
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: 'Please provide name and address' });
    }

    // The auth middleware gives us req.user
    const property = await Property.create({
      name,
      address,
      pgOwner: req.user.pgOwner, // Link the property to the logged-in PGOwner
    });

    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get all properties for the logged-in user
 * @route   GET /api/properties
 * @access  Private
 */
const getProperties = async (req, res) => {
  try {
    // The auth middleware gives us req.user
    // We find only the properties that match the logged-in user's pgOwner ID
    const properties = await Property.find({ pgOwner: req.user.pgOwner });

    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Update an existing property
 * @route   PUT /api/properties/:id
 * @access  Private
 */
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // --- SECURITY CHECK ---
    // Check if the logged-in user is the owner of this property
    if (property.pgOwner.toString() !== req.user.pgOwner.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const { name, address } = req.body;
    property.name = name || property.name;
    property.address = address || property.address;

    const updatedProperty = await property.save();

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Delete a property
 * @route   DELETE /api/properties/:id
 * @access  Private
 */
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // --- SECURITY CHECK ---
    // Check if the logged-in user is the owner of this property
    if (property.pgOwner.toString() !== req.user.pgOwner.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await property.deleteOne();

    res.status(200).json({ message: 'Property removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  createProperty,
  getProperties,
  updateProperty,
  deleteProperty,
};
