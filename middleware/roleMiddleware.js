// roleMiddleware.js
const roleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
      const user = req.user; // Assumes the authenticated user is attached to req.user by authMiddleware
      
      // Check if the user exists and their role is within the required roles
      if (!user || !requiredRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }
      
      // User has the correct role, allow them to proceed to the next middleware or route
      next();
    };
  };
  
  module.exports = roleMiddleware;
  