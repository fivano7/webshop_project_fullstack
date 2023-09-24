const express = require('express');
const {
  getCarts,
  getCart,
  createCart,
  updateCart,
  deleteCart,
} = require('../controllers/carts');

const advancedResults = require('../middleware/advancedResults');
const Cart = require('../models/Cart');

// CURRENT ROUTE: api/v1/carts
const router = express.Router();

// ROUTE "/"
router
  .route('/')
  .get(advancedResults(Cart, 'cartItems'), getCarts)
  .post(createCart);

// ROUTE "/:id"
router.route('/:id').get(getCart).put(updateCart).delete(deleteCart);

module.exports = router;
