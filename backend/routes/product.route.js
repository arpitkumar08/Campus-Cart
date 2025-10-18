const express = require("express");
const productController = require("../controllers/product.controller");
const { protect } = require('../middlewares/auth.middleware')

const router = express.Router();

// ✅ Add product
router.post("/addproduct", productController.addProduct);

// ✅ Delete product
router.delete("/deleteproduct/:id", productController.deleteProduct);

// ✅ Get all products
router.get("/", productController.getAllProducts);

// ✅ Get products by logged-in user
router.get("/mylisting", protect, productController.mylistedProducts);

// ✅ Update product
router.put("/update/:id", protect, productController.updateProduct);

// 🔧 FIXED: Changed route to match frontend call
router.get('/product/:id', productController.getProductDetails);

router.post("/:id/markAsSold", protect, productController.markAsSold);

module.exports = router;