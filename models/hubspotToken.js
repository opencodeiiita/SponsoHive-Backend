const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId: { type: String, required: true }, 
    state:{ type: String, required: true }, // used for fetching tokens
    access_token: { type: String, default: null },
    refresh_token: { type: String, default: null },
    expires_in: { type: Date, default: null }, // timestamp of expiration
});

const hubspotTokens = mongoose.model('hubspotTokens', tokenSchema);
module.exports = hubspotTokens;