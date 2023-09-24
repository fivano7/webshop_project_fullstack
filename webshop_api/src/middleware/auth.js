const asyncHandler = require('./asyncHandler');
const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

//Adds user to request if user is succesfully validated
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  //User bearer token for authentication
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  //Use cookie for authentication
  else if (req.cookies._webShopAuthToken) {
    token = req.cookies._webShopAuthToken;
    console.log(`Cookie authetication used`)
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  //Verify token
  try {
    //{ id: 'xxxuseridxxx', iat: xxx, exp: xxx }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Add user to request (user is detected by id in jwt token)
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

//Grant access to specific roles (can be multiple with ...roles)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    //If user role isn't one of the authorized roles throw error
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
