const Property = require('../models/property.model.js');
const Tenant = require('../models/tenant.model.js');
const Payment = require('../models/payment.model.js');
const Expense = require('../models/expense.model.js'); 

/**
 * @desc    Get dashboard analytics for the logged-in PG Owner
 * @route   GET /api/dashboard/stats?month=9&year=2025
 * @access  Private
 */
const getDashboardStats = async (req, res) => {
  try {
    const pgOwnerId = req.user.pgOwner;

    // --- 1. Handle Date Queries for Month Selection ---
    const now = new Date();
    // Get month and year from query params, or default to current month/year
    // Note: JS months are 0-indexed (Jan=0), so we subtract 1 from the query
    const month = req.query.month ? parseInt(req.query.month) - 1 : now.getMonth();
    const year = req.query.year ? parseInt(req.query.year) : now.getFullYear();

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0);

    // --- 2. Basic Counts (These are independent of the date) ---
    const totalProperties = await Property.countDocuments({ pgOwner: pgOwnerId });
    const totalTenants = await Tenant.countDocuments({ pgOwner: pgOwnerId });
    const overdueTenants = await Tenant.countDocuments({
      pgOwner: pgOwnerId,
      paymentStatus: 'Overdue',
    });

    // --- 3. Monthly Revenue Calculation (Aggregation) ---
    const revenueResult = await Payment.aggregate([
      { $match: { pgOwner: pgOwnerId, paymentDate: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);
    const monthlyRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // --- 4. NEW: Monthly Expenses Calculation (Aggregation) ---
    const expenseResult = await Expense.aggregate([
      { $match: { pgOwner: pgOwnerId, expenseDate: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, totalExpenses: { $sum: '$amount' } } },
    ]);
    const monthlyExpenses = expenseResult.length > 0 ? expenseResult[0].totalExpenses : 0;
    
    // --- 5. NEW: Profit Calculation ---
    const monthlyProfit = monthlyRevenue - monthlyExpenses;

    // --- 6. Combine all stats into the response object ---
    res.status(200).json({
      // Add the date context to the response so the frontend knows what it's looking at
      analyticsFor: {
        month: month + 1, // Convert back to 1-indexed for display
        year: year,
      },
      totalProperties,
      totalTenants,
      overdueTenants,
      monthlyRevenue,
      monthlyExpenses, // <-- New
      monthlyProfit,   // <-- New
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getDashboardStats,
};

