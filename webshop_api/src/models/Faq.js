const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a FAQ question'],
    unique: true,
    trim: true,
  },
  answer: {
    type: String,
    required: [true, 'Please add a FAQ answer'],
  },
});

module.exports = mongoose.model('Faq', FaqSchema);
