const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { createHmac, randomBytes } = require('node:crypto') // We called this builtin package to hash
const {createTokenForUser} = require('../services/auth');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    enum: ["Admin", "Manager", "Contributor"],
    default: "Contributor", // Default role is Contributor
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  salt: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false, // Account is unverified by default
  },
  verificationToken: {
    type: String, // Token for email verification
  },
  socialMediaEnabled:{
    type: Boolean,
    default: false
  }
});

// UserSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     try {
//       const salt = await bcrypt.genSalt(8);
//       this.password = await bcrypt.hash(this.password, salt);
//       next();
//     } catch (error) {
//       return next(error);
//     }
//   } else {
//     next();
//   }
// });
UserSchema.pre('save', function (next) {
  const user = this // this points to current user

  // If the password hasn't been modified, skip hashing
  if (!user.isModified('password')) return next()

  const salt = randomBytes(16).toString('hex') // Fix: Added 'hex' encoding
  const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex')

  this.salt = salt
  this.password = hashedPassword
  next() // Ensure to call next() to proceed
})

UserSchema.methods.isPasswordValid = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Error comparing password");
  }
};

UserSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
  const user = await this.findOne({ email })
  if (!user) throw new Error('User not found')

  const salt = user.salt
  const hashedPassword = user.password
  const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex') // Fix: Typo corrected

  if (hashedPassword !== userProvidedHash) throw new Error('Wrong password!')
  // return { ...user.toObject(), password: undefined, salt: undefined } // Fix: Use .toObject() to return a plain object
  
  const token = createTokenForUser(user)
  return token
  // When user is validated, we are returning the token generated for the user
})
module.exports = mongoose.model("User", UserSchema);