const express = require("express");
const { 
    handleGenerateTrackingURL, 
    handleEmailTracking, 
    handleLogClick, 
    handleGetClickCount, 
    handleGetCTR 
} = require("../controllers/CtrController.js");

const router = express.Router();

router.post("/generate-link", handleGenerateTrackingURL);
router.post("/log-click", handleLogClick);
router.get("/click-count", handleGetClickCount);
router.get("/get-ctr", handleGetCTR);

module.exports = router;