const express = require('express');
const {
  getNewsletterSubscribers,
  getNewsletterSubscriber,
  createNewsletterSubscriber,
  updateNewsletterSubscriber,
  deleteNewsletterSubscriber,
  sendEmailToSubscribers,
  confirmEmail,
  sendEmailToAdmin,
} = require('../controllers/newslettersubscribers');

const advancedResults = require('../middleware/advancedResults');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// CURRENT ROUTE: api/v1/newslettersubscribers
const router = express.Router();

// ROUTE "/"
router
  .route('/')
  .get(advancedResults(NewsletterSubscriber), getNewsletterSubscribers)
  .post(createNewsletterSubscriber);

// ROUTE "/:id"
router
  .route('/:id')
  .get(getNewsletterSubscriber)
  .put(updateNewsletterSubscriber)
  .delete(deleteNewsletterSubscriber);

// ROUTE "/confirmemail/:confirmemailtoken'"
router.route('/confirmemail/:confirmemailtoken').get(confirmEmail);

// ROUTE "/sendemail"
router.route('/sendemail').post(sendEmailToSubscribers);

// ROUTE "/contactadmin"
router.route('/contactadmin').post(sendEmailToAdmin);

module.exports = router;
