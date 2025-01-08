const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { connectDB } = require("./config/db.js");
const authRoute = require("./routes/authRoutes");
const templateRoute = require("./routes/email");
const CtrRoute=require("./routes/CtrRoutes.js");
const campaignRoutes = require('./routes/campaignRoutes');
const emailListRoute = require("./routes/emailListRoutes.js");
const testRoutes = require('./routes/testRoutes');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authMiddleware');
const uploadRoutes = require('./routes/upload');
const trackingRoute = require('./routes/emailTrackingRoute');
const http = require('http');
const {initializeSocket} = require('./services/socketService');
const hubspotRoutes = require('./routes/hubspotRoutes');
const unsubscribeRoutes = require('./routes/UnsubsribeRoutes');

const crmRoutes = require('./routes/crmIntegrationRoutes.js');
const socialMediaRoutes = require('./routes/socialMediaRoutes');
const verificationRoutes = require('./routes/senderVerification.js');
const integrationRoutes = require('./routes/integration');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// Initialize Socket.io
const server = http.createServer(app);
initializeSocket(server);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/ctr",CtrRoute);
app.use("/api/unsubscribe", unsubscribeRoutes);
app.use("/api/crm", crmRoutes);

app.use('/api/upload', uploadRoutes); //For testing upload middleware
app.use('/oauth', hubspotRoutes); // For hubspot integration
app.use("/api/social",socialMediaRoutes);
app.use("/api/verify",verificationRoutes); // For sender email verification
app.use("/api/integration",integrationRoutes);

// Catch-all for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Register the campaign routes
app.use("/api/campaigns", campaignRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server;
