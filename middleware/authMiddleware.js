const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateToken } = require("../services/auth");



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
function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
      const tokenCookieValue = req.cookies[cookieName];

      if (!tokenCookieValue) {
          // Return early if the cookie is missing
          return next();
      }

      try {
          const userPayload = validateToken(tokenCookieValue);
          req.user = userPayload;
          return next(); // Call next after attaching userPayload to req
      } catch (error) {
          return next(); // Call next on error, allowing next middleware to handle the error
      }
  };
}
module.exports = {checkForAuthenticationCookie,authMiddleware};
