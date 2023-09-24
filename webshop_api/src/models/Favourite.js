const mongoose = require('mongoose');

const FavouriteSchema = new mongoose.Schema({
  favouriteItems: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'FavouriteItem',
    },
  ],
});

FavouriteSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    const favouriteItemIdArray = this.favouriteItems;

    if (favouriteItemIdArray && favouriteItemIdArray.length > 0) {
      await mongoose.model('FavouriteItem').deleteMany({
        _id: { $in: favouriteItemIdArray },
      });
    }

    next();
  }
);

module.exports = mongoose.model('Favourite', FavouriteSchema);
