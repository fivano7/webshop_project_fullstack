const express = require('express');
const {
  getProduct,
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  productPhotoUpload,
} = require('../controllers/products');

const advancedResults = require('../middleware/advancedResults');
const Product = require('../models/Product');
const { authorize, protect } = require('../middleware/auth');

//CURRENT ROUTE: api/v1/products
const router = express.Router();

//ROUTE "/"
router
  .route('/')
  .get(advancedResults(Product, 'category', true), getProducts)
  .post(protect, authorize('admin'), createProduct);

//ROUTE "/:id"
router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

//ROUTE "/:id/photo"
router.route('/:id/photo').put(protect, authorize('admin'), productPhotoUpload);

module.exports = router;
