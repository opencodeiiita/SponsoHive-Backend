const express = require("express");

const {handleGenerateTrackingURL , handleEmailTracking, handleEmailReplies , handleEventWebhook} = require("../controllers/trackingController.js");
const { getBounceComplaintRate } = require("../controllers/analyticsController.js");

const router = express.Router();

// to generate a unique tracking url for every email sent and save it to the database and will be embedded into email html as an invisible tracking pixel
router.post("/generate",handleGenerateTrackingURL);

// route for handling email open events
router.post("/track",handleEmailTracking);

// route for handling email replies
router.post("/replies",handleEmailReplies);

router.post("/webhook/events",handleEventWebhook); // Route to handle webhook events

router.get("/bouncecomplaint/:campaignId",getBounceComplaintRate); // Route to get bounce and complaint rate

module.exports = router;