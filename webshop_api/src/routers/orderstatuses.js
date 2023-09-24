const express = require('express');
const {
  getOrderStatuses,
  getOrderStatus,
  updateOrderStatus,
  deleteOrderStatus,
  createOrderStatus,
} = require('../controllers/orderstatuses');

const advancedResults = require('../middleware/advancedResults');
const OrderStatus = require('../models/OrderStatus');

// CURRENT ROUTE: api/v1/orderstatuses
const router = express.Router();

// ROUTE "/"
router
  .route('/')
  .get(advancedResults(OrderStatus), getOrderStatuses)
  .post(createOrderStatus);

// ROUTE "/:id"
router
  .route('/:id')
  .get(getOrderStatus)
  .put(updateOrderStatus)
  .delete(deleteOrderStatus);

module.exports = router;
