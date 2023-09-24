const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name can not be more than 50 characters'],
    },
    image: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  //For virtual
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Create additional field in response (and not in db)
CategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id', //categoryId from here
  foreignField: 'category', //"category" in "Product" model
  justOne: false, //return array or objects, not object
});

//Match product isDeleted with category isDeleted
CategorySchema.pre('save', async function (next) {
  if (this.isModified('isDeleted')) {
    const newIsDeletedValue = this.isDeleted;
    await this.model('Product').updateMany(
      { category: this._id },
      { $set: { isDeleted: newIsDeletedValue } }
    );
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema);
