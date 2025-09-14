const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please provide an expense description'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide the expense amount'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Utilities', // Electricity, Water, Gas, Internet
        'Maintenance', // Repairs, Plumbing, Electrical
        'Staff Salary',
        'Supplies', // Cleaning supplies, etc.
        'Marketing',
        'Other',
      ],
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
    // Link to the PGOwner to enforce multi-tenancy
    pgOwner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'PGOwner',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
