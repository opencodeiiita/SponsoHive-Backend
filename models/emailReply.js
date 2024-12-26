const mongoose = require('mongoose');

const emailReplySchema = new mongoose.Schema({
  campaignId: { type: String, required: true },
  recipientId: { type: String, required: true },
  messageId: { type: String, required: true },
  timestamp: { type: Date, default: null },
});

module.exports = mongoose.model('EmailReplies', emailReplySchema);
