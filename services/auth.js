// import jwt from 'jsonwebtoken';

// // Define the secret key as a constant
// const secret = '$uperMan@123';

// // Function to create a token for a user
// function createTokenForUser(user): string {
//     const payload = {
//         _id: user._id,
//         email: user.email,
//     };

//     const token = jwt.sign(payload, secret);
//     return token;
// }

// // Function to validate a token and return the decoded payload
// function validateToken(token: string): jwt.JwtPayload {
//     const payload = jwt.verify(token, secret) as jwt.JwtPayload;
//     return payload;
// }

// // Export the functions
// export { createTokenForUser, validateToken };


const jwt = require("jsonwebtoken");

const secret = "$uperMan@123";

function createTokenForUser(user) {
  const payload = { _id: user._id, email: user.email };
  return jwt.sign(payload, secret);
}

function validateToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { createTokenForUser, validateToken };
