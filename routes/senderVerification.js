const express = require("express");
const { sendVerificationEmail , senderVerificationWebhook , getVerificationStatus} = require("../services/senderVerificationService");
const {sendEmail} = require("../services/emailService");

const router = express.Router();

router.post("/email", sendVerificationEmail);
router.post("/webhook", senderVerificationWebhook);
router.get("/status/:userId", getVerificationStatus);

module.exports = router;