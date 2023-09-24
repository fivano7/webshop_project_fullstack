const mongoose = require('mongoose');

const OrderStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    required: [true, 'Please add a order status'],
  },
  comment: {
    type: String,
    required: [true, 'Please add a order comment'],
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model('OrderStatus', OrderStatusSchema);
