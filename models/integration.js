const mongoose = require("mongoose");

const IntegrationSchema = new mongoose.Schema({
    userEmail: { type: String, required: true }, // Reference to the user
    integrationName: { type: String, required: true }, // e.g., "HubSpot", "Twitter"
    type: { type: String, enum: ['oauth', 'data'], required: true }, // Type of integration
    status: { type: String, enum: ['Active', 'Inactive', 'Failed'], default: 'Active' },
    lastSync: { type: Date, default: null }, // Timestamp of last successful sync
    token: { 
      accessToken: { type: String, default: null }, 
      refreshToken: { type: String, default: null }, 
      tokenExpiry: { type: Date, default: null } // For OAuth integrations
    },
    data: { type: Object, default: null }, // Stores data for non-OAuth integrations (Twitter/LinkedIn)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  const Integration = mongoose.model('Integration', IntegrationSchema);
  module.exports = Integration;