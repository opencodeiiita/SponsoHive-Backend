const crypto = require('crypto');

// Generate Code Verifier
function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url'); // Base64 URL-safe encoding
}

// Generate Code Challenge from Code Verifier
function generateCodeChallenge(codeVerifier) {
  return crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
}

module.exports = { generateCodeVerifier, generateCodeChallenge };
