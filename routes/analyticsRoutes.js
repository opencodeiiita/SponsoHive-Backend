const express = require("express");
const { getAnalytics } = require("../controllers/analyticsController");

// Provide analytic of a particular campaign 
router.get("/", getAnalytics);

const router = express.Router();


module.exports = router;
