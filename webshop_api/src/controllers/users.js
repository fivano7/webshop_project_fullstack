const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Cart = require('../models/Cart');
const Favourite = require('../models/Favourite');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = asyncHandler(async (req, res, next) => {
  //Also users with isDeleted:true
  res.status(200).json(res.advancedResults);
});

// @desc    Get single user
// @route   GET /api/v1/users/:id
// @access  Public
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user || user.isDeleted) {
    return next(
      new ErrorResponse(`User not found with the id of ${req.params.id}`)
    );
  }
  res.status(200).json({ success: true, data: user });
});

// @desc    Create new user
// @route   POST /api/v1/users
// @access  Public
exports.createUser = asyncHandler(async (req, res, next) => {
  delete req.body.role;
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Public
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { cartId, favouriteId, isDeleted } = req.body;

  let user = await User.findById(req.params.id);
  if (!user || user.isDeleted) {
    return next(
      new ErrorResponse(`User not found with the id of ${req.params.id}`)
    );
  }

  // Forbid deleting user with PUT method
  if (isDeleted) {
    return next(new ErrorResponse(`Field 'isDeleted' can't be updated`, 400));
  }

  if (cartId) {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return next(
        new ErrorResponse(`Cart not found with the id of ${cartId}`, 404)
      );
    }
  }

  if (favouriteId) {
    const favourite = await Favourite.findById(favouriteId);
    if (!favourite) {
      return next(
        new ErrorResponse(
          `Favourite not found with the id of ${favouriteId}`,
          404
        )
      );
    }
  }

  delete req.body.role;

  user = await User.findByIdAndUpdate(
    req.params.id,
    { ...req.body, cart: cartId, favourite: favouriteId },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: user });
});

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Public
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user || user.isDeleted) {
    return next(
      new ErrorResponse(`User not found with the id of ${req.params.id}`)
    );
  }

  await User.findByIdAndUpdate(req.params.id, { isDeleted: true });

  res.status(200).json({ success: true, data: {} });
});
