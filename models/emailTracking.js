const mongoose = require('mongoose');

const emailTrackingSchema = new mongoose.Schema({
  campaignId: { type: String, required: true },
  recipientId: { type: String, required: true },
  trackingurl: { type: String, required: true },
  timestamp: { type: Date, default: null },
});

module.exports = mongoose.model('EmailTracking', emailTrackingSchema);
