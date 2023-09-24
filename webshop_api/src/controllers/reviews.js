const Review = require('../models/Review');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate('user')
    .populate('product');

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with the id of ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: review });
});

// @desc    Create new review
// @route   POST /api/v1/reviews
// @access  Public
exports.createReview = asyncHandler(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  if (rating > 5 || rating < 1) {
    return next(
      new ErrorResponse(`Rating must be between 1 and 5`)
    );
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(
      new ErrorResponse(`Product not found with the id of ${productId}`)
    );
  }

  const review = await Review.create({
    ...req.body,
    product: productId,
    user: req.user
  });

  res.status(201).json({ success: true, data: review });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Public
exports.updateReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with the id of ${req.params.id}`)
    );
  }

  review = await Review.findByIdAndUpdate(
    req.params.id,
    { rating, comment },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: review });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Public
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`Review not found with the id of ${req.params.id}`)
    );
  }

  await review.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
