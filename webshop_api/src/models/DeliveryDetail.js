const mongoose = require('mongoose');

const DeliveryDetailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
  },
  country: {
    type: String,
    required: [true, 'Please add country'],
  },
  city: {
    type: String,
    required: [true, 'Please add city'],
  },
  postalCode: {
    type: String,
    required: [true, 'Please add postal code'],
  },
  street: {
    type: String,
    required: [true, 'Please add street'],
  },
  firstName: {
    type: String,
    required: [true, 'Please add first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please add last name'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number'],
  },
});

module.exports = mongoose.model('DeliveryDetail', DeliveryDetailSchema);
