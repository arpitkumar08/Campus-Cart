const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

// ✅ Add product
router.post("/addproduct", productController.addProduct);

// ✅ Delete product
router.delete("/deleteproduct/:id", productController.deleteProduct);

// ✅ Get all products
router.get("/", productController.getAllProducts);

// ✅ Get products listed by a specific user
// Example: GET /api/products/mylisting?owner=USER_ID
router.get("/mylisting", productController.mylistedProducts);

module.exports = router;
