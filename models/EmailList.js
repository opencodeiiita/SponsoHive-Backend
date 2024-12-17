const mongoose = require('mongoose');

const emailListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tags: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const EmailList = mongoose.model('EmailList', emailListSchema);
module.exports = EmailList;
