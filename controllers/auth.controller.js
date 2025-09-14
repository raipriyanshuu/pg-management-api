const PGOwner = require('../models/pgOwner.model.js');
const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

// @desc    Register a new PG Owner and their first User
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    // 1. Get data from the request body
    const { pgOwnerName, name, email, password } = req.body;

    // 2. Simple Validation: Check if all fields are present
    if (!pgOwnerName || !name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // 3. Check for Duplicates: See if a PG or User already exists
    const pgOwnerExists = await PGOwner.findOne({ name: pgOwnerName });
    if (pgOwnerExists) {
      return res.status(400).json({ message: 'A PG business with this name already exists.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'A user with this email already exists.' });
    }

    // 4. Create the PGOwner (the "Tenant")
    const newPGOwner = await PGOwner.create({
      name: pgOwnerName,
    });

    // 5. Create the User and link them to the PGOwner
    const newUser = await User.create({
      name,
      email,
      password, // Password will be hashed automatically by our model's pre-save hook
      pgOwner: newPGOwner._id, // This is the crucial multi-tenant link!
    });

    // 6. Generate a Golden Ticket (JWT Token) for immediate login
    const token = jwt.sign(
      { id: newUser._id, pgOwner: newUser.pgOwner },
      process.env.JWT_SECRET,
      {
        expiresIn: '30d',
      }
    );

    // 7. Send a successful response
    res.status(201).json({
      message: 'PG Owner and User registered successfully!',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        pgOwner: newUser.pgOwner,
      },
    });
  } catch (error) {
    // 8. Handle any other unexpected errors
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};


// --- NEW LOGIN FUNCTION ---

// @desc    Authenticate a user and get a token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });

    // 2. If user exists, check if password matches
    // We use a custom method on our user model for this
    if (user && (await user.matchPassword(password))) {
      // 3. If everything is correct, generate a new token
      const token = jwt.sign(
        { id: user._id, pgOwnerId: user.pgOwner },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      // 4. Send back the user info and token
      res.status(200).json({
        message: 'Login successful!',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          pgOwner: user.pgOwner,
        },
      });
    } else {
      // 5. If user not found or password incorrect, send error
      res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  register,
  loginUser,
};

