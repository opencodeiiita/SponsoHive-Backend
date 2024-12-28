const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Active', 'Unsubscribed', 'Bounced'], default: 'Active' },
  updatedAt: { type: Date, default: Date.now },
});

// Static method to count all statuses
recipientSchema.statics.getStatusCounts = async function () {
    const counts = await this.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } } // Sort by count in descending order
    ]);
    return counts;
};
  
module.exports = mongoose.model('RecipientStatus', recipientSchema);

//A recepient.js was already there but it did not had the status field, i did not change it to prevent some already working functionality to have some bugs.