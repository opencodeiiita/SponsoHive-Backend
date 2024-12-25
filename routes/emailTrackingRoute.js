const express = require("express");
const { 
    handleGenerateTrackingURL, 
    handleEmailTracking, 
    handleLogClick, 
    handleGetClickCount, 
    handleGetCTR 
} = require("../controllers/trackingController.js");

const router = express.Router();

router.post("/generate", handleGenerateTrackingURL);
router.post("/track", handleEmailTracking);
router.post("/log-click", handleLogClick);
router.get("/click-count", handleGetClickCount);
router.get("/ctr", handleGetCTR);

module.exports = router;
