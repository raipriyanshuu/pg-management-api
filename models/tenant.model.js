const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tenant name is required'],
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'], // Enforces specific values
    },
    rentAmount: {
      type: Number,
      required: [true, 'Rent amount is required'],
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['Paid', 'Unpaid', 'Overdue'], // Enforces specific values
      default: 'Unpaid',
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    whatsappNumber: {
      type: String,
      trim: true,
      // Not required, can be the same as mobile
    },
    documentUrl: {
      type: String,
      default: '',
    },
  
    property: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Property', // Links to the specific Property
    },
    pgOwner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'PGOwner', // Links back to the PGOwner
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;

