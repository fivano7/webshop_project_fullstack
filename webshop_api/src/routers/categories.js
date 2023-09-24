const express = require('express');
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  categoryPhotoUpload,
} = require('../controllers/categories');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const Category = require('../models/Category');

//CURRENT ROUTE: /api/v1/categories
const router = express.Router();

//ROUTE "/"
router
  .route('/')
  .get(advancedResults(Category, null, true), getCategories)
  .post(createCategory);

//ROUTE "/:id"
router
  .route('/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

//ROUTE "/:id/photo"
router
  .route('/:id/photo')
  .put(protect, authorize('admin'), categoryPhotoUpload);

module.exports = router;
