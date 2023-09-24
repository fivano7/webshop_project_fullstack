const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  stripeWebhook,
  cancelOrder,
  addOrderStatus,
  updatePaidStatus,
} = require('../controllers/orders');

const advancedResults = require('../middleware/advancedResults');
const Order = require('../models/Order');

// CURRENT ROUTE: api/v1/orders
const router = express.Router();

// Route: /api/v1/orders
router
  .route('/')
  .get(advancedResults(Order, 'orderItems orderStatuses user'), getOrders)
  .post(createOrder);

// Route: /api/v1/orders/:id
router.route('/:id').get(getOrder).put(updateOrder).delete(deleteOrder);

// Route: /api/v1/orders/:id/cancel
router.route('/:id/cancel').put(cancelOrder)

module.exports = router;
