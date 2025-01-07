const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    campaignId: { type: String, required: true },
    emailsSent: { type: Number, default: 0 },
    totalOpens: { type: Number, default: 0 },
    openRate: { type: Number, default: 0 },
    totalReplies: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 },
    clickThroughRate: { type: Number, default: 0 },
    unsubscribeCount: { type: Number, default: 0 },
    bounceCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    complaintCount: { type: Number, default: 0 },
});

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;