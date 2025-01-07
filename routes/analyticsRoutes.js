const express = require("express");
const { getAnalytics , getBounceComplaintRate} = require("../controllers/analyticsController");

// Provide analytic of a particular campaign 
router.get("/", getAnalytics);

router.get("/:campaignId", getBounceComplaintRate);

const router = express.Router();


module.exports = router;
