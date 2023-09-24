const Product = require('../models/Product');
const Category = require('../models/Category');

const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const FeaturedItem = require('../models/FeaturedItem');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'user',
      model: 'User'
    }
  }).populate("category");

  if (!product || product.isDeleted) {
    return next(
      new ErrorResponse(`Product not found with the id of ${req.params.id}`)
    );
  }
  res.status(200).json({ success: true, data: product });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Public
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { categoryId, price, discountPrice } = req.body;

  if (!req.files || !req.files.productImages) {
    throw new ErrorResponse(`You must upload at least one image`, 400);
  }

  if (discountPrice && discountPrice >= price) {
    throw new ErrorResponse(`Discount price must be lower than price`, 400);
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(
      new ErrorResponse(`You must choose valid category. Selected category: ${categoryId}`)
    );
  }

  const files = req.files.productImages;
  req.body.images = await uploadImages(files);

  const product = await Product.create({ ...req.body, category: categoryId });

  res.status(201).json({ success: true, data: product });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Public
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { isDeleted, discountPrice, price, categoryId } = req.body;

  let product = await Product.findById(req.params.id);
  if (!product || product.isDeleted) {
    return next(
      new ErrorResponse(`Product not found with the id of ${req.params.id}`)
    );
  }

  //Forbid deleting product with PUT method
  if (isDeleted) {
    return next(new ErrorResponse(`Field 'isDeleted' can't be updated`, 400));
  }

  if (req.files && req.files.productImages) {
    const files = req.files.productImages;
    req.body.images = await uploadImages(files);
  }

  if (discountPrice && discountPrice >= price) {
    throw new ErrorResponse(`Discount price must be lower than price`, 400);
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body, category: categoryId },
    {
      new: true,
      runValidators: true,
    });

  res.status(200).json({ success: true, data: product });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Public
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product || product.isDeleted) {
    return next(
      new ErrorResponse(`Product not found with the id of ${req.params.id}`)
    );
  }

  //Remove from featured products
  const featuredItem = await FeaturedItem.findOne();
  const featuredProducts = featuredItem.featuredProducts;

  featuredItem.featuredProducts = featuredProducts.filter(
    (productId) => productId.toString() !== req.params.id
  );

  await featuredItem.save();

  //Soft delete product
  await Product.findByIdAndUpdate(req.params.id, { isDeleted: true });

  res.status(200).json({ success: true, data: {} });
});

// @desc    Upload photo for product
// @route   PUT api/v1/products/:id/photo
// @access  Private
exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product || product.isDeleted) {
    return next(
      new ErrorResponse(`Product not found with the id of ${req.params.id}`)
    );
  }

  if (!req.files || !req.files.productImages) {
    return next(new ErrorResponse(`Please upload files`, 400));
  }

  const files = Array.isArray(req.files.productImages)
    ? req.files.productImages //array
    : [req.files.productImages]; //[singleImage]

  for (const file of files) {
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload image files only`, 400));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image with less than ${process.env.MAX_FILE_UPLOAD / 1000000
          } megabytes`,
          400
        )
      );
    }

    //photo_64c5703a7575ddfd93c770f9_1690662428686.png
    const fileName = `photo_${product._id}_${Date.now()}${path.parse(file.name).ext
      }`;

    // Save to file system (mv->move)
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${fileName}`, async (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
    });

    // Add the file name to the images array of a product
    product.images.push(fileName);
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { images: product.images },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedProduct.images,
  });
});

const uploadImages = async (files) => {
  const uploadedFileNames = [];
  const filesToUpload = Array.isArray(files) ? files : [files];

  for (const file of filesToUpload) {
    if (!file.mimetype.startsWith('image')) {
      throw new ErrorResponse(`Please upload only image files`, 400);
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
      throw new ErrorResponse(
        `Please upload an image with size less than ${process.env.MAX_FILE_UPLOAD / 1000000
        } megabytes`,
        400
      );
    }

    const fileName = `photo_${Date.now()}${path.parse(file.name).ext}`;
    await file.mv(`${process.env.FILE_UPLOAD_PATH}/${fileName}`);
    uploadedFileNames.push(fileName);
  }

  return uploadedFileNames;
};
