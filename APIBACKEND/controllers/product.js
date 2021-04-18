const ErrorResponse = require("../utils/errorResponse");
const Product = require("../model/product");
const asyncHandler = require("../middleware/async");
//To get the file name extension line .jpg,.png
const path = require("path");
const { CLIENT_RENEG_LIMIT } = require("tls");


//--------------------CREATE product-----------------

exports.createProduct = asyncHandler(async (req, res, next) => {

  const product = await Product.create(req.body);

  if (!product) {
    return next(new ErrorResponse("Error adding Product"), 404);
  }

  res.status(201).json({
    success: true,
    data: product,
  });
});

//-------------------Display all product

exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.find({});
  
    res.status(201).json({
      success: true,
      count: product.length,
      data: product,
    });
  });

  // -----------------FIND product BY ID-------------------

exports.getProductById = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorResponse("product not found"), 404);
    }
  
    res.status(200).json({
      success: true,
      data: product,
    });
  });

  // -----------------DELETE Product------------------------

exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorResponse(`No product found `), 404);
    }
  
    await product.remove();
  
    res.status(200).json({
      success: true,
      count: product.length,
      data: {},
    });
  });


  //-------------------UPDATE Product---------------------
  exports.updateProduct= asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorResponse(`No Product found `), 404);
    }
  
    await product.put();
  
    res.status(200).json({
      success: true,
      count: product.length,
      data: {},
    });
  });

  // ------------------UPLOAD IMAGE-----------------------

exports.ProductPhotoUpload = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
  
    if (!product) {
      return next(new ErrorResponse(`No product found with ${req.params.id}`), 404);
    }
  
  
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
  
    const file = req.files.file;
  
    // Make sure the image is a photo and accept any extension of an image
    // if (!file.mimetype.startsWith("image")) {
    //   return next(new ErrorResponse(`Please upload an image`, 400));
    // }
  
    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  
    file.name = `photo_${product.id}${path.parse(file.name).ext}`;
  
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.err(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
  
      //insert the filename into database
      await Product.findByIdAndUpdate(req.params.id, {
        photo: file.name,
      });
    });
  
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });