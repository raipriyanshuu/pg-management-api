const Expense = require('../models/expense.model.js');

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
const createExpense = async (req, res) => {
  try {
    const { description, amount, category, expenseDate } = req.body;

    if (!description || !amount || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const expense = await Expense.create({
      description,
      amount,
      category,
      expenseDate,
      pgOwner: req.user.pgOwner, // Link to the logged-in user's PG business
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all expenses for the logged-in owner
// @route   GET /api/expenses
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ pgOwner: req.user.pgOwner }).sort({ expenseDate: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
const updateExpense = async (req, res) => {
    // This logic is very similar to updateProperty and updateTenant
    // Find the expense, check ownership, then update.
    // For brevity in this example, we are focusing on create and get.
    // This can be built out using the same pattern.
    res.status(501).json({ message: 'Update functionality not yet implemented.' });
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
const deleteExpense = async (req, res) => {
    // This logic is very similar to deleteProperty and deleteTenant
    // Find the expense, check ownership, then delete.
    // For brevity in this example, we are focusing on create and get.
    // This can be built out using the same pattern.
     res.status(501).json({ message: 'Delete functionality not yet implemented.' });
};

module.exports = {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};
