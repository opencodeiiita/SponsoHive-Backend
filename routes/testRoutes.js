// routes/testRoutes.js

const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');  // Authentication Middleware
const roleMiddleware = require('../middleware/roleMiddleware');  // Role Middleware

// Test Route for RBAC Validation
router.get('/rbac', authMiddleware, roleMiddleware(['Admin']), (req, res) => {
  // If the user is authenticated and has the Admin role, this will run
  res.status(200).json({ message: 'Access granted. You are an Admin!' });
});

module.exports = router;
