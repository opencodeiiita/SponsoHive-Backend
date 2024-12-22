const mongoose = require("mongoose");

const recipientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  orderId: { type: String },
  // Add other fields as needed
});

module.exports = mongoose.model("Recipient", recipientSchema);
