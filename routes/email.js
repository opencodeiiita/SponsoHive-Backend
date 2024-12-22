const express = require("express");
const { createEmailTemplate, getEmailTemplate } = require("../controllers/emailController");
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post("/", upload.single("file"), createEmailTemplate);

router.get("/", getEmailTemplate);

module.exports = router;