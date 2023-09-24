const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5'],
  },
  comment: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      //used to filter reviews based on given productId
      $match: { product: productId },
    },
    {
      //used to group all reviews with the same product id together
      $group: {
        _id: '$product',
        //defines new field "avgRating" which value is average of all "rating" fields from ReviewSchema
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  //status = [{"_id": "xxproductIdxx","avgRating": 4.5}]
  try {
    if (stats.length > 0) {
      const avgRating = stats[0].avgRating;
      await this.model('Product').findByIdAndUpdate(productId, {
        averageRating: avgRating,
      });
    } else {
      await this.model('Product').findByIdAndUpdate(productId, {
        averageRating: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.product);
});

ReviewSchema.post('deleteOne', { document: true }, async function () {
  await this.constructor.getAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
