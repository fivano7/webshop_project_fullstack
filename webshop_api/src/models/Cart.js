const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CartItem',
    },
  ],
});

CartSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    const cartItemIdArray = this.cartItems;

    if (cartItemIdArray && cartItemIdArray.length > 0) {
      //Models are registered globally so they can be accessed with "this" or "mongoose"
      await mongoose.model('CartItem').deleteMany({
        //Delete items in CartItem collection that have "_id"s same as one in cartItemIdArray
        _id: { $in: cartItemIdArray },
      });
    }

    next();
  }
);

CartSchema.methods.clearCartItems = async function () {
  try {
    await mongoose.model('CartItem').deleteMany({ _id: { $in: this.cartItems } });
    this.cartItems = [];
    await this.save();
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('Cart', CartSchema);
