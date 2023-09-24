const mongoose = require('mongoose');

const FavouriteItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
});

module.exports = mongoose.model('FavouriteItem', FavouriteItemSchema);
