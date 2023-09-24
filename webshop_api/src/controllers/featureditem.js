const Featured = require('../models/FeaturedItem');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get single featured item
// @route   GET /api/v1/featureditem
// @access  Public
exports.getFeaturedItem = asyncHandler(async (req, res, next) => {
  const featuredItem = await Featured.findOne().populate('featuredProducts');
  if (!featuredItem) {
    return next(new ErrorResponse('Featured item not found', 404));
  }
  res.status(200).json({ success: true, data: featuredItem });
});

// @desc    Create new featured item
// @route   POST /api/v1/featureditem
// @access  Public
exports.createFeaturedItem = asyncHandler(async (req, res, next) => {
  const { featuredProducts } = req.body;

  const existingFeaturedItem = await Featured.findOne();
  if (existingFeaturedItem) {
    return next(new ErrorResponse('Featured item already exists', 400));
  }

  // Check if every product exists
  for (const productId of featuredProducts) {
    const product = await Product.findById(productId);
    if (!product) {
      return next(
        new ErrorResponse(`Product not found with the id of ${productId}`, 404)
      );
    }
  }

  const featuredItem = await Featured.create(req.body);

  res.status(201).json({ success: true, data: featuredItem });
});

// @desc    Update featured item
// @route   PUT /api/v1/featureditem
// @access  Public
exports.updateFeaturedItem = asyncHandler(async (req, res, next) => {
  const { featuredProducts } = req.body;

  // Provjera je li već postoji "featuredItem"
  const featuredItem = await Featured.findOne();
  if (!featuredItem) {
    return next(new ErrorResponse('Featured item not found', 404));
  }

  // Check if every product exists
  if (featuredProducts) {
    for (const productId of featuredProducts) {
      const product = await Product.findById(productId);
      if (!product) {
        return next(
          new ErrorResponse(`Product not found with the id of ${productId}`, 404)
        );
      }
    }
  }

  const updatedItem = await Featured.findByIdAndUpdate(
    featuredItem._id,
    req.body,
    {
      new: true, // Vraća ažurirani dokument kao rezultat
      runValidators: true, // Provjerava valjanost ažuriranih podataka prema shemi
    }
  );

  res.status(200).json({ success: true, data: updatedItem });
});

// @desc    Delete featured item
// @route   DELETE /api/v1/featureditem
// @access  Public
exports.deleteFeaturedItem = asyncHandler(async (req, res, next) => {
  const featuredItem = await Featured.findOne();
  if (!featuredItem) {
    return next(new ErrorResponse('Featured item not found', 404));
  }

  await featuredItem.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
