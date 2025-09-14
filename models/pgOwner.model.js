const mongoose = require('mongoose');

// Define the schema for the PG Owner
const pgOwnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'PG business name is required.'],
      trim: true, // Removes whitespace from the beginning and end
      unique: true,
    },
  },
  {
    // Automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// Create the model from the schema
const PGOwner = mongoose.model('PGOwner', pgOwnerSchema);

module.exports = PGOwner;
