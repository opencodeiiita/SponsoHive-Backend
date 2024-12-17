const User = require("../models/User");

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

module.exports = { createUser };
