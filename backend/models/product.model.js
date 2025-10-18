const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  isNegotiable: { type: Boolean, required: true },
  images: [{ type: String }],
  condition: { type: String, required: true },
  status: { type: String, default: "available" }, // 👈 add this
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = Product;
