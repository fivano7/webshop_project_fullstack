const mongoose = require('mongoose');
const crypto = require('crypto');

const NewsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    unique: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  confirmEmailToken: {
    type: String,
    default: null,
  },
});

//Generate and hash confirm email token
NewsletterSubscriberSchema.statics.getConfirmEmailToken = function () {
  const confirmToken = crypto.randomBytes(20).toString('hex');
  const confirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmToken)
    .digest('hex');

  return { confirmToken, confirmEmailToken };
};

module.exports = mongoose.model(
  'NewsletterSubscriber',
  NewsletterSubscriberSchema
);
