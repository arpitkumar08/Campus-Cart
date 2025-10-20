const express = require("express");
const router = express.Router();
const { getUsersCount, getProductsCount, getReportedProductCount, getUserGrowth, getProductGrowth, getProductByCategory, getAllUsers, getAllProducts, getSoldItemsCount } = require("../controllers/admin.controller");


// DASHBOARD ROUTES
router.get("/users/count", getUsersCount);
router.get("/products/count", getProductsCount)
router.get("/reportedProducts/count", getReportedProductCount)
router.get("/products/sold/count", getSoldItemsCount)
router.get("/charts/users", getUserGrowth)
router.get("/charts/products", getProductGrowth)
router.get("/charts/categories", getProductByCategory)

// USER MANAGEMENT ROUTES
router.get("/users", getAllUsers)
router.get("/products", getAllProducts)


// router.put("/users/admin/users/:id")
module.exports = router;
