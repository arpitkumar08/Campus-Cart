const Product = require('../models/product.model');

exports.addProduct = async (req, res) => {
    const {
        title,
        category,
        price,
        isNegotiable,
        images = [],      // default empty array
        condition,
        status = "Available", // default status
        location,
        owner
    } = req.body;

    try {
        // Validate required fields
        if (
            !title ||
            !category ||
            price === undefined ||
            isNegotiable === undefined ||
            !condition ||
            !location ||
            !owner
        ) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Check if product already exists for this user
        const productAlreadyExists = await Product.findOne({ title, owner });
        if (productAlreadyExists) {
            return res.status(400).json({ message: "Product already listed." });
        }

        // Create new product
        const product = await Product.create({
            title,
            category,
            price,
            isNegotiable,
            images,
            condition,
            status,
            location,
            owner
        });

        res.status(201).json({
            success: true,
            message: "Product listed successfully.",
            product
        });
    } catch (error) {
        console.error("Error in uploading product.", error);
        res.status(500).json({ message: "Error in uploading product", error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found." });

        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted successfully." });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};
