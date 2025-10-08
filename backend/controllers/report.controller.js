const Report = require('../models/report.model')
const Product = require('../models/product.model')
// POST: Report a product
exports.reportProduct = async (req, res) => {
  try {
    const { productId, reason } = req.body;
    const userId = req.user._id; // get from auth middleware

    // check if already reported
    const existingReport = await Report.findOne({ productId, reportedBy: userId });
    if (existingReport) {
      return res.status(400).json({ message: "You already reported this product." });
    }

    const newReport = new Report({
      productId,
      reportedBy: userId,
      reason,
    });

    await newReport.save();
    return res.status(201).json({ message: "Product reported successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET: Fetch all reports (for Admin)
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("productId", "name price imageUrl")
      .populate("reportedBy", "name email");
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE: Admin deletes a reported product
exports.deleteReportedProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    await Product.findByIdAndDelete(productId);
    await Report.deleteMany({ productId });

    res.json({ message: "Product and its reports deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
