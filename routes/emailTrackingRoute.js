const express = require("express");
const emailTracking = require("../models/emailTracking.js");

const {handleGenerateTrackingURL , handleEmailTracking} = require("../controllers/trackingController.js");

const router = express.Router();

// to generate a unique tracking url for every email sent and save it to the database
// and will be embedded into email html as an invisible tracking pixel
router.post("/generate",handleGenerateTrackingURL);

// route for handling email open events
router.post("/track",handleEmailTracking);


module.exports = router;