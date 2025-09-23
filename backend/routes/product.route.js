const express = require('express');
const { addProduct, deleteProduct } = require('../controllers/product.controller');
const router = express.Router()




router.post('/addproduct', addProduct)
router.post('/deleteproduct/:id', deleteProduct)

module.exports = router;
