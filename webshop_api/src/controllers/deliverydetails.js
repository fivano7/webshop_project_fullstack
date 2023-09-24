const DeliveryDetail = require('../models/DeliveryDetail');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all delivery details
// @route   GET /api/v1/deliverydetails
// @access  Public
exports.getDeliveryDetails = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single delivery detail
// @route   GET /api/v1/deliverydetails/:id
// @access  Public
exports.getDeliveryDetail = asyncHandler(async (req, res, next) => {
  const deliveryDetail = await DeliveryDetail.findById(req.params.id).populate(
    'user'
  );
  if (!deliveryDetail) {
    return next(
      new ErrorResponse(
        `Delivery detail not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: deliveryDetail });
});

// @desc    Create new delivery detail
// @route   POST /api/v1/deliverydetails
// @access  Public
exports.createDeliveryDetail = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  //If userId is not provided guest wants to create new deliveryDetail
  if (userId) {
    const user = await User.findById(userId)
    if (!user) {
      return next(
        new ErrorResponse(
          `User not found with the id of ${userId}`,
          404
        )
      );
    }
    req.body.user = userId
  }

  const deliveryDetail = await DeliveryDetail.create(req.body);
  res.status(201).json({ success: true, data: deliveryDetail });
});

// @desc    Update delivery detail
// @route   PUT /api/v1/deliverydetails/:id
// @access  Public
exports.updateDeliveryDetail = asyncHandler(async (req, res, next) => {
  let deliveryDetail = await DeliveryDetail.findById(req.params.id);
  if (!deliveryDetail) {
    return next(
      new ErrorResponse(
        `Delivery detail not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  delete req.body.user

  deliveryDetail = await DeliveryDetail.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: deliveryDetail });
});

// @desc    Delete delivery detail
// @route   DELETE /api/v1/deliverydetails/:id
// @access  Public
exports.deleteDeliveryDetail = asyncHandler(async (req, res, next) => {
  const deliveryDetail = await DeliveryDetail.findById(req.params.id);
  if (!deliveryDetail) {
    return next(
      new ErrorResponse(
        `Delivery detail not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  await deliveryDetail.deleteOne();

  res.status(200).json({ success: true, data: {} });
});
