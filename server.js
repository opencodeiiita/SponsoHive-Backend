const express = require("express");
const dotenv = require("dotenv");
const router = require("./routes/emailListRoutes");
const { connectDB } = require("./config/db.js");
const authRoute = require("./routes/authRoutes");
const templateRoute = require("./routes/email");
const emailListRoute = require("./routes/emailListRoutes.js");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());

// Basic Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/user", authRoute);
app.use("/api/template", templateRoute);

app.use("/api/email-lists", router);
app.use("/api/email-lists", emailListRoute);

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = server; // Export the server instance