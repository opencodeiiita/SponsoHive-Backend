const dotenv = require("dotenv");//to load environment variables
dotenv.config()

const express = require("express");

const router = require("./routes/emailListRoutes");
const userRoute = require("./routes/authRoutes");
const {connectToMongoDB} = require("./config/db");
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middleware/authMiddleware');


// Load environment variables

// Connect to MongoDB
connectToMongoDB('mongodb://127.0.0.1:27017/sponsohive')


// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));

app.use("/",userRoute)

// Basic Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.get("/api/email-lists", router);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
