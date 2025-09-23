const express = require('express');
const { addProduct } = require('../controllers/product.controller');
const router = express.Router()




router.post('/addproduct', addProduct)

module.exports = router;
