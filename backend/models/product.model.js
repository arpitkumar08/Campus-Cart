const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    isNegotiable: { type: Boolean, default: false },
    images: [{ type: String, required: true }],
    condition: { type: String, enum: ["New", "Like New", "Good", "Used"], required: true },
    status: { type: String, enum: ["Available", "Sold"], default: "Available" },
    location: { type: String, required: true },

    // The user who listed this product
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    views: { type: Number, default: 0 },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
