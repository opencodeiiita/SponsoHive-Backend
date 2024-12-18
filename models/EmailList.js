const mongoose = require('mongoose');

const emailListSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tags: { type: [String], default: [] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emails: { type: [String], default: [] } //Was needed in to schedule Emails, add Validation
}, { timestamps: true }); 

const EmailList = mongoose.model('EmailList', emailListSchema);

module.exports = EmailList;
