const express = require("express");
const router = express.Router();
const { getUsersCount, getProductsCount, getReportedProductCount } = require("../controllers/admin.controller");

// GET /api/admin/users/count
router.get("/users/count", getUsersCount);
router.get("/products/count", getProductsCount)
router.get("/reportedProducts/count", getReportedProductCount)

// You can add more routes here later, e.g., /packages/count, /orders/count

module.exports = router;
