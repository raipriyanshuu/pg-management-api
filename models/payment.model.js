const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
    },
    paymentDate: {
      type: Date,
      required: [true, 'Payment date is required'],
      default: Date.now, // Defaults to the moment it's created
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'UPI', 'Bank Transfer', 'Other'],
      default: 'Cash',
    },
    // --- The Crucial Links for Data Integrity ---
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Tenant', // Direct link to the Tenant who paid
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Property', // Link to the Property for easy filtering
    },
    pgOwner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'PGOwner', // Top-level link for security
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
