const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists." });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
};
// Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.APP_PASSCODE, // Your email password
  },
});

// Signup function with email verification
async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;

  try {
    // Generate a unique verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    console.log("Verification URL:", verificationToken);

   

    // Create a new user with the verification token
    await User.create({
      name,
      email,
      password,
      verificationToken,
    });

    // Send verification email
    const verificationUrl = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
    console.log("Verification URL:", verificationUrl);
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationUrl}">${verificationUrl}</a>`,
    });

    return res.status(201).json({
      message: "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Signup failed",
      details: error.message,
    });
  }
}

// Login function with verification check
async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the account is verified
    if (!user.verified) {
      return res.status(403).json({ error: "Account not verified. Please check your email." });
    }

    // Generate a token if the password is correct
    const token = await User.matchPasswordAndGenerateToken(email, password);

    // Set the token as a cookie and redirect to the homepage
    return res.cookie("token", token, { httpOnly: true }).redirect("/");
  } catch (error) {
    return res.status(500).json({
      error: "Login failed",
      details: error.message,
    });
  }
}

// Email verification function
async function verifyEmail(req, res) {
  const { token } = req.params;

  try {
    // Find the user with the verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    // Mark the user as verified
    user.verified = true;
    user.verificationToken = undefined; // Clear the token after verification
    await user.save();

    return res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    return res.status(500).json({
      error: "Email verification failed",
      details: error.message,
    });
  }
}
module.exports = { createUser, handleUserSignup,
  handleUserLogin,
  verifyEmail, };
