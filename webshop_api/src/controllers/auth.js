const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const Favourite = require('../models/Favourite');
const FavouriteItem = require('../models/FavouriteItem');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  //Generate confirm email token
  const { confirmToken, confirmEmailToken } = User.getConfirmEmailToken();

  const cart = (await Cart.create({ cartItems: [] }))._id
  const favourite = (await Favourite.create({ favouriteItems: [] }))._id

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    confirmEmailToken,
    cart,
    favourite
  });

  //Create confirm url sent to email api/v1/auth/confirmemail/xxx
  const confirmUrl = `${process.env.FRONTEND_URL}/confirmation/user/${confirmToken}`;

  const subject = 'Email confirmation';
  const message = `<html lang="en"><head><style> body {font-family: Arial, sans-serif; background-color: white; color: black; text-align: center; } .container { width:85%; border: 4px solid black; padding: 20px; display: inline-block; } .button { display: inline-block; background-color: black; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; }    </style>  </head>  <body>    <div class="container"> <h1>Smith Pottery | Webshop</h1> <p>Thank you for registering to Webshop! Please click on the following link to confirm your email address:</p> <a href="${confirmUrl}" class="button">Confirm Email</a></div></body></html>`

  try {
    await sendEmail({
      email: user.email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      data: 'Confirmation email sent',
    });
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    return next(new ErrorResponse('Unable to create user', 500));
  }
});

// @desc    Confirm email with confirmemailtoken
// @route   GET /api/v1/auth/confirmemail/:confirmemailtoken
// @access  Public
exports.confirmEmail = asyncHandler(async (req, res, next) => {
  const { confirmemailtoken } = req.params;
  const hashedConfirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmemailtoken)
    .digest('hex');

  const user = await User.findOne({
    confirmEmailToken: hashedConfirmEmailToken,
  });

  if (!user || user.isDeleted) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }

  user.confirmEmailToken = null;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: 'Email confirmed successfully',
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const { cartId, favouriteId } = req.query;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  const user = await User.findOne({ email })
    .select('+password')
    .populate([
      {
        path: 'cart',
        populate: {
          path: 'cartItems',
          model: 'CartItem',
        },
      },
      {
        path: 'favourite',
        populate: {
          path: 'favouriteItems',
          model: 'FavouriteItem',
        },
      },
    ]);

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (user.confirmEmailToken !== null) {
    return next(
      new ErrorResponse('Please confirm your email address before login', 401)
    );
  }

  //Merge user cart with the guest cart, if provided
  if (cartId) {
    const guestCart = await Cart.findById(cartId).populate({
      path: 'cartItems',
      populate: {
        path: 'product',
        model: 'Product',
      },
    });

    if (guestCart) {
      for (const guestCartItem of guestCart.cartItems) {
        const existingCartItem = user.cart.cartItems.find(
          (userCartItem) =>
            userCartItem.product.toString() ===
            guestCartItem.product._id.toString()
        );
        //User already has the same product in the cart -> increase quantity
        if (existingCartItem) {
          existingCartItem.quantity += guestCartItem.quantity;
          await existingCartItem.save();
        }
        //User doesn't have the same product in the cart -> add it
        else {
          const copyCartItem = await CartItem.create({
            product: guestCartItem.product._id,
            quantity: guestCartItem.quantity,
          });
          const cart = user.cart;
          cart.cartItems.push(copyCartItem);
          await cart.save();
        }
      }

      await guestCart.deleteOne();
      // await user.save();
    }
  }

  //Merge user favourites with the guest favourites, if provided
  if (favouriteId) {
    const guestFavourite = await Favourite.findById(favouriteId).populate({
      path: 'favouriteItems',
      populate: {
        path: 'product',
        model: 'Product',
      },
    });

    if (guestFavourite) {
      for (const guestFavouriteItem of guestFavourite.favouriteItems) {
        const existingFavouriteItem = user.favourite.favouriteItems.find(
          (userFavouriteItem) =>
            userFavouriteItem.product.toString() ===
            guestFavouriteItem.product._id.toString()
        );
        // User doesn't have the same product in favourites -> add it
        if (!existingFavouriteItem) {
          const copyFavouriteItem = await FavouriteItem.create({
            product: guestFavouriteItem.product._id,
          });
          const favourite = user.favourite;
          favourite.favouriteItems.push(copyFavouriteItem);
          await favourite.save();
        }
      }

      await guestFavourite.deleteOne();
      // await user.save();
    }
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
  //we have access to res.cookie because of "cookie-parser" middleware
  res.cookie('_webShopAuthToken', 'none', {
    //cookie set to "none" and removed completely after 10 seconds
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // request contains user because of "protect" middleware function in auth.js
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email } = req.body;

  //We dont want to update password etc.
  const fieldsToUpdate = {
    firstName,
    lastName,
    email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(
      new ErrorResponse('Please provide current password and new password', 400)
    );
  }

  const user = await User.findById(req.user.id).select('+password');

  //Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse('Current password is incorrent'), 401);
  }

  if (currentPassword === newPassword) {
    return next(
      new ErrorResponse(
        'New password cannot be the same as the current password',
        400
      )
    );
  }

  user.password = newPassword;

  //middleware hashes password
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.isDeleted) {
    res.status(200).json({
      success: true,
      data: 'If there is a user account associated with this email, a password reset email will be sent.',
    });
    return;
  }

  //Get reset token
  const resetToken = user.getResetPasswordToken();

  //Save user in db with "resetPasswordToken" & "resetPasswordExpire" fields from getResetPasswordToken()
  await user.save({ validateBeforeSave: false });

  //Create reset url sent to email /api/v1/auth/resetpassword/xxx
  const resetUrl = `${process.env.FRONTEND_URL}/user/new-password/${resetToken}`;
  const subject = 'Password reset';
  const message = `<html lang="en"><head><style> body {font-family: Arial, sans-serif; background-color: white; color: black; text-align: center; } .container { width:85%; border: 4px solid black; padding: 20px; display: inline-block; } .button { display: inline-block; background-color: black; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; }    </style>  </head>  <body>    <div class="container"> <h1>Smith Pottery | Webshop</h1> <p>You are receiving this email because you (or someone else) has requested the reset of a password. Click this button to reset password:</p> <a href="${resetUrl}" class="button">Reset Password</a></div></body></html>`

  try {
    await sendEmail({
      email: user.email, //recipient's email
      subject,
      message,
    });

    res.status(200).json({
      success: true,
      data: 'If there is a user account associated with this email, a password reset email will be sent.',
    });
  } catch (err) {
    //Reset fields in db if there is a error sending reset email
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password with resettoken
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const { resettoken } = req.params;
  //Hash resetToken (so its the same as the one in the database)
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resettoken)
    .digest('hex');

  //Finds user that has that token and makes sure expire date hasn't passed
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user || user.isDeleted) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }

  user.password = password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  //encripts new password with middleware
  await user.save();

  sendTokenResponse(user, 200, res);
});

//HELPER FUNCTION -> Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  //Cookie options
  const options = {
    expires: new Date(
      //we cant define days in config env so we count them manually
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    //cookie can't be accessed or changed with JS on client side, prevents XSS attacks
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('_webShopAuthToken', token, options) //cookieName, jwt token, cookie options
    .json({ success: true, token });
};
