const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db.js');

// Import routes
const authRoutes = require('./routes/auth.routes.js');
const userRoutes = require('./routes/user.routes.js');
const propertyRoutes = require('./routes/property.routes.js'); 
const dashboardRoutes = require('./routes/dashboard.routes.js');
const expenseRoutes = require('./routes/expense.routes.js');


// --- Step 1: Basic Setup ---
dotenv.config();
connectDB();
const app = express();

// --- Step 2: Middleware ---
// IMPORTANT: This line MUST come BEFORE your routes are defined.
// This is the "package opener" that creates the req.body object for us.
app.use(cors());
app.use(express.json());

// --- Step 3: Routes ---
// Now that the body is parsed, the request can be sent to the correct route.
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes); 
app.use('/api/dashboard', dashboardRoutes); 
app.use('/api/expenses', expenseRoutes); 

// Simple test route
app.get('/', (req, res) => {
  res.send('PG Management API is running...');
});

// --- Step 4: Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

