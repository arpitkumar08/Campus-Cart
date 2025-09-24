const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

// ✅ Add product (now only JSON, no multer)
router.post("/addproduct", productController.addProduct);

// ✅ Delete product
router.delete("/deleteproduct/:id", productController.deleteProduct);

module.exports = router;
