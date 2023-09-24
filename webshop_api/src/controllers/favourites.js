const Favourite = require('../models/Favourite');
const FavouriteItem = require('../models/FavouriteItem');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/Product');

// @desc    Get all favourites
// @route   GET /api/v1/favourites
// @access  Public
exports.getFavourites = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single favourite
// @route   GET /api/v1/favourites/:id
// @access  Public
exports.getFavourite = asyncHandler(async (req, res, next) => {
  const favourite = await Favourite.findById(req.params.id).populate({
    path: 'favouriteItems',
    populate: {
      path: 'product',
      model: 'Product',
    },
  });

  if (!favourite) {
    return next(
      new ErrorResponse(`Favourite not found with the id of ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: favourite });
});

// @desc    Check if the product exists in favourite
// @route   GET /api/v1/favourites/:id/:productId
// @access  Public
exports.checkProductInFavourite = async (req, res, next) => {
  const { favouriteid, productid } = req.params;

  let favourite = await Favourite.findById(favouriteid).populate({
    path: 'favouriteItems',
    populate: {
      path: 'product',
      model: 'Product',
    },
  });

  if (!favourite) {
    return next(
      new ErrorResponse(
        `Favourite not found with the id of ${favouriteid}`,
        404
      )
    );
  }

  const productExistsInFavourite = favourite.favouriteItems.some(
    (favouriteItem) => favouriteItem.product._id.toString() === productid
  );
  res.status(200).json({ success: true, data: { productExistsInFavourite } });
};

// @desc    Create new favourite
// @route   POST /api/v1/favourites
// @access  Public
exports.createFavourite = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  let product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    return next(
      new ErrorResponse(
        `Product with the id of ${productId} can't be added to favorites because it's either deleted or not available`,
        404
      )
    );
  }

  const favouriteItem = await FavouriteItem.create({ product: productId });
  const favourite = await Favourite.create({
    ...req.body,
    favouriteItems: [favouriteItem._id],
  });
  res.status(201).json({ success: true, data: favourite });
});

// @desc    Update favourite
// @route   PUT /api/v1/favourites/:id
// @access  Public
exports.updateFavourite = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  let favourite = await Favourite.findById(req.params.id).populate({
    path: 'favouriteItems',
    populate: {
      path: 'product',
      model: 'Product',
    },
  });

  let product = await Product.findById(productId);

  if (!favourite) {
    return next(
      new ErrorResponse(
        `Favourite not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  if (!product) {
    return next(
      new ErrorResponse(
        `Product with the id of ${productId} does not exist`,
        400
      )
    );
  }

  const existingFavouriteItem = favourite.favouriteItems.find(
    (favouriteItem) => favouriteItem.product._id.toString() === productId
  );

  if (existingFavouriteItem) {
    await removeFavouriteItem(favourite, productId);
  } else {
    // Add product to favourites
    if (product.isDeleted) {
      return next(
        new ErrorResponse(
          `Product with the id of ${productId} can't be added to favourites`,
          400
        )
      );
    }

    const favouriteItem = await FavouriteItem.create({ product: productId });
    favourite.favouriteItems.push(favouriteItem);
  }

  await favourite.save({ runValidators: true });
  res.status(200).json({ success: true, data: favourite });
});

// @desc    Delete favourite
// @route   DELETE /api/v1/favourites/:id
// @access  Public
exports.deleteFavourite = asyncHandler(async (req, res, next) => {
  const favourite = await Favourite.findById(req.params.id);
  if (!favourite) {
    return next(
      new ErrorResponse(`Favourite not found with the id of ${req.params.id}`)
    );
  }

  await favourite.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

//HELPER FUNCTION
async function removeFavouriteItem(favourite, productId) {
  const favouriteItemIndex = favourite.favouriteItems.findIndex(
    (favouriteItem) => favouriteItem.product._id.toString() === productId
  );
  if (favouriteItemIndex !== -1) {
    const favouriteItemId = favourite.favouriteItems[favouriteItemIndex]._id;
    favourite.favouriteItems.splice(favouriteItemIndex, 1); // Remove from array
    await FavouriteItem.findByIdAndDelete(favouriteItemId); // Remove from database
  }
}
