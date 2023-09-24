const express = require('express');
const {
  getFaqs,
  getFaq,
  createFaq,
  updateFaq,
  deleteFaq,
} = require('../controllers/faqs');

const advancedResults = require('../middleware/advancedResults');
const Faq = require('../models/Faq');

// CURRENT ROUTE: api/v1/faqs
const router = express.Router();

//ROUTE "/"
router.route('/').get(advancedResults(Faq), getFaqs).post(createFaq);

//ROUTE "/:id"
router.route('/:id').get(getFaq).put(updateFaq).delete(deleteFaq);

module.exports = router;
