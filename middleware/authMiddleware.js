const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // If no token is provided, return an error
  if (!token) {
    return res.status(401).json({ message: "No token provided. Authentication failed." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user by decoded ID
    const user = await User.findById(decoded.id);
    
    // If the user does not exist, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    
    // Attach user to request object
    req.user = user;
    
    // Proceed to the next middleware or route
    next();
  } catch (error) {
    // If token is invalid or expired, return an error
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
