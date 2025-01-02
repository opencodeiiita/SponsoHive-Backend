const mongoose = require('mongoose');

const socialMediaSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    linkedin: {
      name: { type: String },
      email_verified: { type: Boolean },
      picture: { type: String },
    },
    twitter: {
      username: { type: String },
      name: { type: String },
      bio: { type: String },
      location: { type: String },
      profileURL: { type: String },
      company: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

module.exports = mongoose.model('SocialMedia', socialMediaSchema);