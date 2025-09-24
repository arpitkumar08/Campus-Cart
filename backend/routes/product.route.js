const express = require('express');
const { addProduct, deleteProduct } = require('../controllers/product.controller');
const router = express.Router();

// ✅ Add product
router.post('/addproduct', addProduct);         // POST /api/products

// ✅ Delete product
router.delete('/deleteproduct/:id', deleteProduct); // DELETE /api/products/:id

module.exports = router;
