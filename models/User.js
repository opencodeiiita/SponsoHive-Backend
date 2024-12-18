const mongoose = require("mongoose");
const { createHmac, randomBytes } = require('node:crypto') // We called this builtin package to hash
const {createTokenForUser} = require('../services/auth');
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  const user = this // this points to current user

  // If the password hasn't been modified, skip hashing
  if (!user.isModified('password')) return next()

  const salt = randomBytes(16).toString('hex') // Fix: Added 'hex' encoding
  const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex')

  this.salt = salt
  this.password = hashedPassword
  next() // Ensure to call next() to proceed
})

// Function to check if password matches
userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
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

const User = mongoose.model("user", userSchema);

module.exports = User;