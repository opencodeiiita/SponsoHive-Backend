const express = require("express");
const { createEmailTemplate, getEmailTemplate } = require("../controllers/emailController");

const router = express.Router();

router.post("/", createEmailTemplate);

router.get("/", getEmailTemplate);

module.exports = router;