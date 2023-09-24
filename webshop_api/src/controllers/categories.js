const Category = require('../models/Category');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');

// @desc    Get all categories
// @route   POST /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate("products");
  if (!category || category.isDeleted) {
    return next(
      new ErrorResponse(
        `Category not found with the id of ${req.params.id}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: category });
});

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Public
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body

  if (!name) {
    return next(new ErrorResponse(`Please provide category name`, 400));
  }

  if (!req.files || !req.files.categoryImage) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.categoryImage;
  req.body.image = await uploadImage(file);

  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Public
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const { isDeleted } = req.body;
  let category = await Category.findById(req.params.id);

  if (!category || category.isDeleted) {
    return next(
      new ErrorResponse(
        `Category not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  //Forbid deleting profile with PUT method
  if (isDeleted) {
    return next(new ErrorResponse(`Field 'isDeleted' can't be updated!`, 400));
  }

  if (req.files && req.files.categoryImage) {
    const file = req.files.categoryImage;
    req.body.image = await uploadImage(file);
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: category });
});

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Public
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category || category.isDeleted) {
    return next(
      new ErrorResponse(
        `Category not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  category.isDeleted = true;
  await category.save();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Upload photo for category
// @route   PUT api/v1/categories/:id/photo
// @access  Private
exports.categoryPhotoUpload = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category || category.isDeleted) {
    return next(
      new ErrorResponse(`Category not found with the id of ${req.params.id}`)
    );
  }

  if (!req.files || !req.files.categoryImage) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }

  const file = req.files.categoryImage;

  category.image = await uploadImage(file);
  await category.save();

  res.status(200).json({
    success: true,
    data: category.image,
  });
});


const uploadImage = async (file) => {
  if (!file.mimetype.startsWith('image')) {
    throw new ErrorResponse(`Please upload an image file`, 400);
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    throw new ErrorResponse(
      `Please upload an image with less than ${process.env.MAX_FILE_UPLOAD / 1000000
      } megabytes`,
      400
    );
  }

  const fileName = `photo_${Date.now()}${path.parse(file.name).ext}`;
  await file.mv(`${process.env.FILE_UPLOAD_PATH}/${fileName}`);
  return fileName;
};