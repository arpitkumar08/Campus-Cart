const express = require("express");
const router = express.Router();
const { getUsersCount, getProductsCount, getReportedProductCount, getUserGrowth, getProductGrowth, getProductByCategory } = require("../controllers/admin.controller");

// GET /api/admin/users/count
router.get("/users/count", getUsersCount);
router.get("/products/count", getProductsCount)
router.get("/reportedProducts/count", getReportedProductCount)
router.get("/charts/users", getUserGrowth)
router.get("/charts/products", getProductGrowth)
router.get("/charts/categories", getProductByCategory)

module.exports = router;
