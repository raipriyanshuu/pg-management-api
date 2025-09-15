const request = require('supertest');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const connectDB = require('../db.js');
const authRoutes = require('../routes/auth.routes.js');
const User = require('../models/user.model.js');
const PGOwner = require('../models/pgOwner.model.js');

dotenv.config();

const app = express();
app.use(express.json()); 
app.use('/api/auth', authRoutes);

describe('Authentication API', () => {

  // Connect to the database before all tests run
  beforeAll(async () => {
    await connectDB();
  });

  // Clear the user and owner collections before each test to ensure a clean slate
  beforeEach(async () => {
    await User.deleteMany({});
    await PGOwner.deleteMany({});
  });

  // Disconnect from the database after all tests are done
  afterAll(async () => {
    await mongoose.connection.close();
  });

  // --- Test Case 1: Successful User Registration ---
  describe('POST /api/auth/register', () => {
    it('should register a new user and pg owner successfully', async () => {
      // 1. Arrange: Prepare the data for our test
      const newUser = {
        pgOwnerName: 'Test PG',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // 2. Act: Make the API request
      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      // 3. Assert: Check if the result is what we expect
      expect(response.statusCode).toBe(201); // Check for "Created" status
      expect(response.body).toHaveProperty('token'); // Check if a token was returned
      expect(response.body.user.email).toBe('test@example.com'); // Check if the correct user was returned

      // Bonus Assert: Verify the user was actually saved in the database
      const savedUser = await User.findOne({ email: 'test@example.com' });
      expect(savedUser).not.toBeNull();
    });

    it('should fail to register a user with an existing email', async () => {
        // First, create a user
        await request(app).post('/api/auth/register').send({
            pgOwnerName: 'Test PG 1',
            name: 'Test User 1',
            email: 'duplicate@example.com',
            password: 'password123',
        });
        
        // Now, try to create another user with the same email
        const response = await request(app).post('/api/auth/register').send({
            pgOwnerName: 'Test PG 2',
            name: 'Test User 2',
            email: 'duplicate@example.com',
            password: 'password123',
        });
        
        // Assert that the server rejected it
        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('A user with this email already exists');
    });
  });

});
