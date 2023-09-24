const express = require('express');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');

const advancedResults = require('../middleware/advancedResults');
const Review = require('../models/Review');
const { protect, authorize } = require('../middleware/auth');

//CURRENT ROUTE: api/v1/reviews
const router = express.Router();

// ROUTE "/"
router
  .route('/')
  .get(advancedResults(Review, 'user product'), getReviews)
  .post(protect, authorize('admin', 'user'), createReview);

// ROUTE "/:id"
router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('admin', 'user'), updateReview)
  .delete(protect, authorize('admin', 'user'), deleteReview);

module.exports = router;
