const express = require("express");
const {
  reportProduct,
  getAllReports,
  deleteReportedProduct,
} = require("../controllers/report.controller");
const { protect, verifyAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", protect, reportProduct); // normal user
router.get("/", protect, verifyAdmin, getAllReports); // admin only
router.delete("/:productId", protect, verifyAdmin, deleteReportedProduct); // admin only

module.exports = router;
