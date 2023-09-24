const express = require('express');
const {
  getDeliveryDetails,
  getDeliveryDetail,
  createDeliveryDetail,
  updateDeliveryDetail,
  deleteDeliveryDetail,
} = require('../controllers/deliverydetails');


const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');
const DeliveryDetail = require('../models/DeliveryDetail');

// CURRENT ROUTE: api/v1/deliverydetails
const router = express.Router();

// ROUTE "/"
router
  .route('/')
  .get(advancedResults(DeliveryDetail, "user"), getDeliveryDetails)
  .post(createDeliveryDetail);

// ROUTE "/:id"
router
  .route('/:id')
  .get(getDeliveryDetail)
  .put(updateDeliveryDetail)
  .delete(deleteDeliveryDetail);

module.exports = router;
