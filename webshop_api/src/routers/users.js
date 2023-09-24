const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// CURRENT ROUTE: api/v1/users
const router = express.Router();

const User = require('../models/User');

//Protect and authorize admin to all /users routes
router.use(protect, authorize('admin'));

// ROUTE "/"
router.route('/').get(advancedResults(User), getUsers).post(createUser);

// ROUTE "/:id"
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
