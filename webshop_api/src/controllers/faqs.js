const Faq = require('../models/Faq');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all faqs
// @route   GET /api/v1/faqs
// @access  Public
exports.getFaqs = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single faq
// @route   GET /api/v1/faqs/:id
// @access  Public
exports.getFaq = asyncHandler(async (req, res, next) => {
  const faq = await Faq.findById(req.params.id);
  if (!faq) {
    return next(
      new ErrorResponse(`FAQ not found with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: faq });
});

// @desc    Create new faq
// @route   POST /api/v1/faqs
// @access  Public
exports.createFaq = asyncHandler(async (req, res, next) => {
  const faq = await Faq.create(req.body);
  res.status(201).json({ success: true, data: faq });
});

// @desc    Update FAQ
// @route   PUT /api/v1/faqs/:id
// @access  Public
exports.updateFaq = asyncHandler(async (req, res, next) => {
  let faq = await Faq.findById(req.params.id);

  if (!faq) {
    return next(
      new ErrorResponse(`FAQ not found with the id of ${req.params.id}`, 404)
    );
  }

  faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: faq });
});

// @desc    Delete FAQ
// @route   DELETE /api/v1/faqs/:id
// @access  Public
exports.deleteFaq = asyncHandler(async (req, res, next) => {
  let faq = await Faq.findById(req.params.id);

  if (!faq) {
    return next(
      new ErrorResponse(`FAQ not found with the id of ${req.params.id}`, 404)
    );
  }

  await faq.deleteOne();
  
  res.status(200).json({ success: true, data: {} });
});
