PG Management System - Backend API
This repository contains the complete backend API for a multi-tenant SaaS (Software as a Service) application designed to help Paying Guest (PG) owners manage their properties, tenants, payments, and expenses efficiently.

This project was built from the ground up using Node.js, Express, and MongoDB, with a focus on creating a secure, scalable, and professional-grade REST API.

Live API
The API is deployed and live on Render. You can interact with it using the base URL below:

Base URL: https://your-pg-api-name.onrender.com

API Documentation
Complete and interactive API documentation has been created and published using Postman. It details all available endpoints, required parameters, and example responses.

View the Documentation: https://documenter.getpostman.com/view/your-collection-id/your-docs-id

Key Features
Secure Authentication: Full user registration and login functionality using JSON Web Tokens (JWT) for secure, stateless authentication.

Multi-Tenancy: A robust data model that ensures complete data isolation between different PG Owners (tenants). A user can only ever access data that belongs to their own organization.

Full CRUD Operations: Comprehensive REST APIs for managing:

Properties: Create, read, update, and delete property records.

Tenants: Nested CRUD to manage tenants within specific properties.

Payments: Nested CRUD to track rent payments for each tenant.

Expenses: Full CRUD to track business expenses.

Business Logic Automation: Recording a payment automatically updates the corresponding tenant's payment status, automating a key business workflow.

Advanced Analytics Dashboard: A powerful aggregation endpoint (/api/dashboard/stats) that calculates real-time business metrics, including:

Total revenue, expenses, and profit for any given month.

Total property and tenant counts.

Number of tenants with overdue payments.

Tech Stack
Backend: Node.js, Express.js

Database: MongoDB with Mongoose (ODM)

Authentication: JSON Web Tokens (JWT), bcrypt.js (for password hashing)

Deployment: Render (Web Service), MongoDB Atlas (Cloud Database)

Development Tools: Postman (API Testing & Documentation), Git & GitHub (Version Control)

To Run Locally
Clone the repository:

git clone [https://github.com/your-username/pg-management-api.git](https://github.com/your-username/pg-management-api.git)

Navigate to the project directory:

cd pg-management-api

Install dependencies:

npm install

Create a .env file in the root and add the following variables:

MONGO_URI=your_local_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000

Start the server:

npm start
