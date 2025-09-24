const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  isNegotiable: { type: Boolean, required: true },
  images: [{ type: String }], // ✅ Accept URLs as strings
  condition: { type: String, required: true },
  status: { type: String, default: "Available" },
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
