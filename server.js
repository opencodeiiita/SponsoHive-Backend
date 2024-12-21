const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");  // Add this import
const { connectDB } = require("./config/db.js");
const authRoute = require("./routes/authRoutes");
const templateRoute = require("./routes/email");
const campaignRoutes = require('./routes/campaignRoutes');
const emailListRoute = require("./routes/emailListRoutes.js");
const testRoutes = require('./routes/testRoutes');  // Import the test route for RBAC validation
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

// Basic Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Health Check Route to test MongoDB connection
app.get("/api/health", (req, res) => {
  if (mongoose.connection.readyState === 1) {
    // MongoDB is connected
    res.status(200).json({ message: "MongoDB is alive and connected!" });
  } else {
    // MongoDB is not connected
    res.status(500).json({ message: "Error connecting to MongoDB." });
  }
});

// Use routes
app.use("/user", authRoute);
app.use("/api/template", templateRoute);
app.use('/api/campaigns', campaignRoutes);
app.get("/api/email-lists", emailListRoute);

// Test RBAC route
app.use('/api/test', testRoutes);  // Use the test route for RBAC validation

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server; // Export the server instance
