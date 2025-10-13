const express = require("express");
const {
  // FIX: Changed 'reportProduct' to 'createReport' to match the controller export.
  createReport,
  getAllReports,
  deleteReportedProduct,
} = require("../controllers/report.controller");
const { protect, verifyAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();

// FIX: Using 'createReport' which is now correctly imported.
router.post("/", protect, createReport); // For a normal user to submit a report

// For admins to view all reports
router.get("/", protect, verifyAdmin, getAllReports);

// For admins to take action (e.g., delete a product)
router.delete("/:productId", protect, verifyAdmin, deleteReportedProduct);

module.exports = router;
