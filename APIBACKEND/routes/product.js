const express = require("express");
const  router = express.Router();

const {
  createProduct,
  getProduct, 
  getProductById,
  deleteProduct,
  ProductPhotoUpload,
  } = require("../controllers/product");

  const { protect } = require("../middleware/auth");

  router
  .route("/")
  .get(protect,getProduct)
  .post(protect,createProduct);

  router
  .route("/:id/photo")
  .put(protect, ProductPhotoUpload);

  router
  .route("/:id")
  .get(protect,getProductById)
  .delete(protect, deleteProduct);


  module.exports = router