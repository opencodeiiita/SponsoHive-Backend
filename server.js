const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db.js");
const authRoute = require("./routes/authRoutes");
const templateRoute = require("./routes/email");
const campaignRoutes = require('./routes/campaignRoutes');
const emailListRoute = require("./routes/emailListRoutes.js");
const testRoutes = require('./routes/testRoutes');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authMiddleware');
const trackingRoute = require('./routes/emailTrackingRoute');

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

// Health Check Route
app.get("/api/health", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ message: "MongoDB is alive and connected!" });
  } catch (error) {
    res.status(500).json({ message: "Error connecting to MongoDB.", error });
  }
});

// Use routes
app.use("/user", authRoute);
app.use("/api/template", templateRoute);
app.use('/api/campaigns', campaignRoutes);
app.use("/api/email-lists", emailListRoute);
app.use('/api/auth/test', testRoutes);  // Logical grouping for RBAC testing
app.use('/api/analytics', trackingRoute); // Route for email tracking

// Catch-all for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
