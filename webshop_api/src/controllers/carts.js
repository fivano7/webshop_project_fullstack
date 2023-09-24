const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/Product');

// @desc    Get all carts
// @route   GET /api/v1/carts
// @access  Public
exports.getCarts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single cart
// @route   GET /api/v1/carts/:id
// @access  Public
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id).populate({
    path: 'cartItems',
    populate: {
      path: 'product',
      model: 'Product',
    },
  });

  if (!cart) {
    return next(
      new ErrorResponse(`Cart not found with the id of ${req.params.id}`)
    );
  }
  res.status(200).json({ success: true, data: cart });
});

// @desc    Create new cart
// @route   POST /api/v1/carts
// @access  Public
exports.createCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 1) {
    return next(new ErrorResponse('Quantity must be a positive integer', 400));
  }

  let product = await Product.findById(productId);

  if (!product || product.isDeleted || !product.isAvailable) {
    return next(
      new ErrorResponse(
        `Product with the id of ${productId} can't be added to cart`,
        404
      )
    );
  }

  const cartItem = await CartItem.create({ product: productId, quantity });
  const cart = await Cart.create({
    ...req.body,
    cartItems: [cartItem._id],
  });
  res.status(201).json({ success: true, data: cart });
});

// @desc    Update cart
// @route   PUT /api/v1/carts/:id
// @access  Public
exports.updateCart = asyncHandler(async (req, res, next) => {
  const { productId, quantity, addToQuantity } = req.body;

  let cart = await Cart.findById(req.params.id).populate({
    path: 'cartItems',
    populate: {
      path: 'product',
      model: 'Product',
    },
  });
  let product = await Product.findById(productId);

  if (!cart) {
    return next(
      new ErrorResponse(`Cart not found with the id of ${req.params.id}`, 404)
    );
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    return next(new ErrorResponse('Quantity must be a positive integer', 400));
  }

  if (!product) {
    return next(
      new ErrorResponse(
        `Product with the id of ${productId} does not exist`,
        400
      )
    );
  }

  const existingCartItem = cart.cartItems.find(
    (cartItem) => cartItem.product._id.toString() === productId
  );

  if (existingCartItem) {
    if (quantity === 0) {
      await removeCartItem(cart, productId);
    } else {
      //Quantity of either deleted on unavailable existing product in cart is changed -> delete CartItem
      if (product.isDeleted || !product.isAvailable) {
        await removeCartItem(cart, productId);
        //Update cart
        await cart.save({ runValidators: true });
        return next(
          new ErrorResponse(
            `This product is removed from the cart because it's either deleted or not available`,
            400
          )
        );
      } else {
        //Update cart item
        if (addToQuantity) {
          existingCartItem.quantity += quantity;
        } else {
          existingCartItem.quantity = quantity;
        }
        await existingCartItem.save({ runValidators: true });
      }
    }
  } else {
    if (product.isDeleted || !product.isAvailable) {
      return next(
        new ErrorResponse(
          `Product with the id of ${productId} can't be added to cart because it's either deleted or not available`,
          400
        )
      );
    }

    const cartItem = await CartItem.create({ product: productId, quantity });
    cart.cartItems.push(cartItem);
  }

  //Update cart
  await cart.save({ runValidators: true });
  res.status(200).json({ success: true, data: cart });
});

// @desc    Delete cart
// @route   DELETE /api/v1/carts/:id
// @access  Public
exports.deleteCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) {
    return next(
      new ErrorResponse(`Cart not found with the id of ${req.params.id}`, 404)
    );
  }

  await cart.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

//HELPER FUNCTION
async function removeCartItem(cart, productId) {
  const cartItemIndex = cart.cartItems.findIndex(
    (cartItem) => cartItem.product._id.toString() === productId
  );
  if (cartItemIndex !== -1) {
    const cartItemId = cart.cartItems[cartItemIndex]._id;
    cart.cartItems.splice(cartItemIndex, 1); // Remove from array
    await CartItem.findByIdAndDelete(cartItemId); // Remove from database
  }
}
