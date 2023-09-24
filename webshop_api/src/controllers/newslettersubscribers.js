const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Get all newsletter subscribers
// @route   GET /api/v1/newslettersubscribers
// @access  Public
exports.getNewsletterSubscribers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single newsletter subscriber
// @route   GET /api/v1/newslettersubscribers/:id
// @access  Public
exports.getNewsletterSubscriber = asyncHandler(async (req, res, next) => {
  const subscriber = await NewsletterSubscriber.findById(req.params.id);
  if (!subscriber) {
    return next(
      new ErrorResponse(
        `Newsletter subscriber not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: subscriber });
});

// @desc    Create new newsletter subscriber
// @route   POST /api/v1/newslettersubscribers
// @access  Public
exports.createNewsletterSubscriber = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const { confirmToken, confirmEmailToken } =
    NewsletterSubscriber.getConfirmEmailToken();

  const subscriber = await NewsletterSubscriber.create({
    email,
    confirmEmailToken,
  });

  // Create confirm url sent to email newslettersubscribers/confirmemail/xxx
  const confirmUrl = `${process.env.FRONTEND_URL}/confirmation/subscription/${confirmToken}`;

  const subject = 'Confirm your email';
  const message = `<html lang="en"><head><style> body {font-family: Arial, sans-serif; background-color: white; color: black; text-align: center; } .container { width:85%; border: 4px solid black; padding: 20px; display: inline-block; } .button { display: inline-block; background-color: black; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; }    </style>  </head>  <body>    <div class="container"> <h1>Smith Pottery | Webshop</h1> <p> Thank you for registering to Smith Pottery webshop! Please click on the following link to confirm your email address: </p> <a href="${confirmUrl}" class="button">Confirm Email</a></div></body></html>`
  try {
    await sendEmail({
      email: subscriber.email,
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      data: 'Successfully subscribed to the newsletter! Please confirm your email address.',
    });
  } catch (err) {
    await NewsletterSubscriber.findByIdAndDelete(subscriber._id);
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Update newsletter subscriber
// @route   PUT /api/v1/newslettersubscribers/:id
// @access  Public
exports.updateNewsletterSubscriber = asyncHandler(async (req, res, next) => {
  let subscriber = await NewsletterSubscriber.findById(req.params.id);

  if (!subscriber) {
    return next(
      new ErrorResponse(
        `Newsletter subscriber not found with the id of ${req.params.id} `,
        404
      )
    );
  }

  subscriber = await NewsletterSubscriber.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, data: subscriber });
});

// @desc    Confirm email with confirmemailtoken
// @route   GET /api/v1/newslettersubscribers/confirmemail/:confirmemailtoken
// @access  Public
exports.confirmEmail = asyncHandler(async (req, res, next) => {
  const hashedConfirmEmailToken = crypto
    .createHash('sha256')
    .update(req.params.confirmemailtoken)
    .digest('hex');

  const subscriber = await NewsletterSubscriber.findOne({
    confirmEmailToken: hashedConfirmEmailToken,
  });

  if (!subscriber) {
    return next(new ErrorResponse('Invalid or expired token', 400));
  }

  subscriber.confirmEmailToken = null;
  subscriber.isActive = true;
  await subscriber.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: 'Email confirmed successfully',
  });
});

// @desc    Delete newsletter subscriber
// @route   DELETE /api/v1/newslettersubscribers/:id
// @access  Public
exports.deleteNewsletterSubscriber = asyncHandler(async (req, res, next) => {
  let subscriber = await NewsletterSubscriber.findById(req.params.id);

  if (!subscriber) {
    return next(
      new ErrorResponse(
        `Newsletter subscriber not found with the id of ${req.params.id} `,
        404
      )
    );
  }

  await subscriber.deleteOne();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Send email to active newsletter subscribers
// @route   POST /api/v1/newslettersubscribers/sendemail
// @access  Public
exports.sendEmailToSubscribers = asyncHandler(async (req, res, next) => {
  const { subject, message } = req.body;

  const activeSubscribers = await NewsletterSubscriber.find({ isActive: true });

  if (!activeSubscribers || activeSubscribers.length === 0) {
    return next(new ErrorResponse('No active subscribers found', 404));
  }

  try {
    const emailPromises = activeSubscribers.map(async (subscriber) => {
      await sendEmail({
        email: subscriber.email,
        subject,
        message,
      });
    });

    await Promise.all(emailPromises);

    res.status(200).json({
      success: true,
      data: 'Emails sent to active subscribers',
    });
  } catch (err) {
    console.error('Error sending emails:', err);
    return next(new ErrorResponse('Error sending emails', 500));
  }
});

// @desc    Send email to admin
// @route   POST /api/v1/newslettersubscribers/contactadmin
// @access  Public
exports.sendEmailToAdmin = asyncHandler(async (req, res, next) => {
  const { email, title, message } = req.body;

  if (!email || !message) {
    return next(new ErrorResponse('You must provide email, title and message', 404));
  }

  const formattedMessage = `<html lang="en"><head><style> body {font-family: Arial, sans-serif; background-color: white; color: black; text-align: center; } .container { width:85%; border: 4px solid black; padding: 20px; display: inline-block; } .button { display: inline-block; background-color: black; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; }    </style>  </head>  <body>    <div class="container"> <h1>Smith Pottery | Webshop</h1> <p> ${message} </p> <p>Send with contact form by ${email} </p></div></body></html>`

  try {
    //no-reply sends the mail to admin
    await sendEmail({
      email: process.env.ADMIN_EMAIL,
      subject: title,
      message: formattedMessage,
    });

    res.status(200).json({
      success: true,
      data: 'Email successfully sent',
    });

  } catch (err) {
    console.error('Error sending email:', err);
    return next(new ErrorResponse('Error sending email', 500));
  }
});