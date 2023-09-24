const express = require('express');
const {
  getFeaturedItem,
  createFeaturedItem,
  updateFeaturedItem,
  deleteFeaturedItem,
} = require('../controllers/featureditem');
const { authorize, protect } = require('../middleware/auth');

// CURRENT ROUTE: api/v1/featureditems
const router = express.Router();

// ROUTE "/"
router
  .route('/')
  .get(getFeaturedItem)
  .post(protect, authorize('admin'), createFeaturedItem)
  .put(protect, authorize('admin'), updateFeaturedItem)
  .delete(protect, authorize('admin'), deleteFeaturedItem);

module.exports = router;
