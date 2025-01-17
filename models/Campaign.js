const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailListId: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailList', required: true },
  schedule: { type: Date, required: true },
  follow_up: { type: Number, default: 3 },
  status: { type: String, enum: ['Scheduled', 'Sent', 'Cancelled', 'Failed'], default: 'Scheduled' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  campaignId: { type: String, required: true }, // campaignid for sending mails
  replyToAddess: { type: String, required: true } // unique address for receiving replies
});

const Campaign = mongoose.model('Campaign', campaignSchema);
module.exports = Campaign;