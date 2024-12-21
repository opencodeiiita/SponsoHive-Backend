require('dotenv').config(); // Load environment variables

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Ensure this path is correct
const { connectDB } = require("../config/db"); // Ensure this path is correct

const seedUsers = async () => {
  // Ensure the MongoDB connection is established before proceeding
  await connectDB();

  // Array of sample users with different roles
  const users = [
    { name: "Admin User", email: "admin@example.com", password: "admin123", role: "Admin" },
    { name: "Manager User", email: "manager@example.com", password: "manager123", role: "Manager" },
    { name: "Contributor User", email: "contributor@example.com", password: "contributor123", role: "Contributor" },
  ];

  // Hash password and insert users into the database
  for (const user of users) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 8); // Hash the user's password
      await User.create({ ...user, password: hashedPassword }); // Insert user into DB
      console.log(`${user.name} seeded successfully!`);
    } catch (error) {
      console.error(`Error seeding user: ${user.name}`, error);
    }
  }

  console.log("All users seeded!");
  mongoose.connection.close(); // Close the DB connection after seeding
};

seedUsers();
