const express = require("express");
const { handleUserLogin,verifyEmail,handleUserSignup } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
// router.get("/verify-email", verifyEmail);/
router.get("/verify/:token", verifyEmail);

module.exports = router;