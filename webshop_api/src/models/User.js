const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please add first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please add last name'],
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    default: 'user',
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
  },
  favourite: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Favourite',
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpire: {
    type: Date,
    default: null,
  },
  confirmEmailToken: {
    type: String,
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Encrypt password when saving to the database
UserSchema.pre('save', async function (next) {
  //If password IS NOT modified while saving user data -> don't do anything
  if (!this.isModified('password')) {
    next();
  }
  
  //If password IS modified -> hash it and put hashed one in user object
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Sign JWT and return, it contains role
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); //true/false
};

//Generate and hash reset password token
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  //Hash token and set resetPasswordToken field with it
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  //Set expire to 10 mins from now
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  //ORIGINAL (returned to user inside a link to reset password) - cadddc1f6fd778fd7a22f3d466c0d6ecfc378fc7
  //HASHED (stored in the database) - 0626898bfd0cf840efc736b0f6ecf568d4caea3be2618b5d950d806a6de4ed1d

  return resetToken;
};

//Generate and hash confirm email token
UserSchema.statics.getConfirmEmailToken = function () {
  const confirmToken = crypto.randomBytes(20).toString('hex');
  const confirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmToken)
    .digest('hex');

  return { confirmToken, confirmEmailToken };
};
module.exports = mongoose.model('User', UserSchema);
