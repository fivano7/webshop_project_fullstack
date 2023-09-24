const mongoose = require('mongoose');

const FeaturedItemSchema = new mongoose.Schema({
  featuredProducts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true,
    },
  ],
  promoMessage: {
    type: String,
  },
});

module.exports = mongoose.model('FeaturedItem', FeaturedItemSchema);
