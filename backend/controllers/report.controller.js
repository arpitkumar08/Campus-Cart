const Report = require('../models/report.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose'); // Import Mongoose to access validation tools


const createReport = async (req, res) => {

  try {
    if (!req.user || !req.user.id) {
      console.error("Authentication error: req.user is not defined on the request object.");
      return res.status(401).json({ msg: "Not authorized, user data missing." });
    }

    const { reportedType, reportedUser, reportedProduct, reason, details } = req.body;
    if (!reportedType || !reason) {
      return res.status(400).json({ msg: 'Report type and reason are required fields.' });
    }

    if (reportedType === 'User') {
      if (!reportedUser) return res.status(400).json({ msg: 'reportedUser ID is required for User reports.' });
      // --- FIX: Validate the ObjectId before querying the database ---
      if (!mongoose.Types.ObjectId.isValid(reportedUser)) {
        return res.status(400).json({ msg: 'Invalid reported user ID format.' });
      }
      const userToReport = await User.findById(reportedUser);
      if (!userToReport) return res.status(404).json({ msg: 'Reported user not found.' });
    } else if (reportedType === 'Product') {
      if (!reportedProduct) return res.status(400).json({ msg: 'reportedProduct ID is required for Product reports.' });
      if (!mongoose.Types.ObjectId.isValid(reportedProduct)) {
        return res.status(400).json({ msg: 'Invalid reported product ID format.' });
      }
      const productToReport = await Product.findById(reportedProduct);
      if (!productToReport) return res.status(404).json({ msg: 'Reported product not found.' });
    } else {
      return res.status(400).json({ msg: 'Invalid reportedType. Must be "User" or "Product".' });
    }

    const report = new Report({
      reporter: req.user.id,
      reason,
      details,
      reportedType,
      reportedUser: reportedType === 'User' ? reportedUser : undefined,
      reportedProduct: reportedType === 'Product' ? reportedProduct : undefined
    });

    await report.save();
    return res.status(201).json({ msg: 'Report submitted successfully.', report });

  } catch (err) {
    console.error("--- UNEXPECTED ERROR IN createReport ---");
    console.error(err);
    console.error("--------------------------------------");
    res.status(500).json({ msg: 'Server error while creating report.' });
  }
};

const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('reporter', 'name email').populate('reportedUser', 'name email').populate('reportedProduct', 'name');
    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
const deleteReportedProduct = async (req, res) => {
  console.log("🟡 Received delete request for ID:", req.params.id); // add this
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    console.log("🔍 Report found before deletion:", report);

    if (!report) return res.status(404).json({ message: "Report not found" });

    res.status(200).json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "Error deleting report", error });
  }
};

module.exports = {
  createReport,
  getAllReports,
  deleteReportedProduct
};

