const express = require('express');
const {
  getFavourites,
  getFavourite,
  createFavourite,
  updateFavourite,
  deleteFavourite,
  checkProductInFavourite,
} = require('../controllers/favourites');

const advancedResults = require('../middleware/advancedResults');
const Favourite = require('../models/Favourite');

// CURRENT ROUTE: api/v1/favourites
const router = express.Router();

// ROUTE "/"
router
  .route('/')
  .get(advancedResults(Favourite, 'favouriteItems'), getFavourites)
  .post(createFavourite);

// ROUTE "/:id"
router
  .route('/:id')
  .get(getFavourite)
  .put(updateFavourite)
  .delete(deleteFavourite);

  // ROUTE "/:id/:productid"
router.route('/:favouriteid/:productid').get(checkProductInFavourite);

module.exports = router;
