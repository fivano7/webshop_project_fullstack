const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  //Product copy
  product: {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      min: [0.01, 'Price must be at least 0.01'],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    stripeProductId: {
      type: String,
    },
    stripePriceId: {
      type: String,
    },
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

module.exports = mongoose.model('OrderItem', OrderItemSchema);
