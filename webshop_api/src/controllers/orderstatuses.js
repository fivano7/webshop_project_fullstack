const OrderStatus = require('../models/OrderStatus');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Order = require('../models/Order');

// @desc    Get all order statuses
// @route   GET /api/v1/orderstatuses
// @access  Public
exports.getOrderStatuses = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single order status
// @route   GET /api/v1/orderstatuses/:id
// @access  Public
exports.getOrderStatus = asyncHandler(async (req, res, next) => {
  const orderStatus = await OrderStatus.findById(req.params.id);
  if (!orderStatus) {
    return next(
      new ErrorResponse(
        `Order status not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: orderStatus });
});

// // @desc    Create new order status
// // @route   POST /api/v1/orderstatuses
// // @access  Public
exports.createOrderStatus = asyncHandler(async (req, res, next) => {
  const { status, comment, orderId } = req.body
  const order = await Order.findById(orderId).populate("orderItems");

  if (!order) {
    return next(
      new ErrorResponse(`Order not found with the id of ${req.params.id}`, 404)
    );
  }

  const orderStatus = await OrderStatus.create({
    status,
    comment
  })

  order.orderStatuses.push(orderStatus._id);
  await order.save();

  res.status(200).json({ success: true, data: orderStatus });
});

// @desc    Update order status
// @route   PUT /api/v1/orderstatuses/:id
// @access  Public
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  let orderStatus = await OrderStatus.findById(req.params.id);
  if (!orderStatus) {
    return next(
      new ErrorResponse(
        `Order status not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  orderStatus = await OrderStatus.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: orderStatus });
});

// @desc    Delete order status
// @route   DELETE /api/v1/orderstatuses/:id
// @access  Public
exports.deleteOrderStatus = asyncHandler(async (req, res, next) => {
  const orderStatus = await OrderStatus.findById(req.params.id);
  if (!orderStatus) {
    return next(
      new ErrorResponse(
        `Order status not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  await orderStatus.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
