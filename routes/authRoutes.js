const express = require("express");
const { createUser,handleUserLogin,verifyEmail,handleUserSignup } = require("../controllers/authController");

const router = express.Router();

router.post("/create", createUser);
router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/verify/:token", verifyEmail);
module.exports = router;
