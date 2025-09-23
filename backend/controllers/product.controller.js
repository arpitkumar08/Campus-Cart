const Product = require('../models/product.model');

exports.addProduct = async (req, res) => {
    const {
        title,
        category,
        price,
        isNegotiable,
        images,
        condition,
        status,
        location,
        owner
    } = req.body;

    try {
        // ✅ Validate required fields
        if (
            !title ||
            !category ||
            price === undefined ||            // check for number
            isNegotiable === undefined ||     // check for boolean
            !images ||
            !condition ||
            !status ||
            !location ||
            !owner
        ) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // ✅ Check if a product with same title by the same owner exists
        const productAlreadyExists = await Product.findOne({
            title,
            owner
        });

        if (productAlreadyExists) {
            return res.status(400).json({ message: "Product already listed." });
        }

        // ✅ Create new product
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

        // ✅ Send response
        res.status(201).json({
            success: true,
            message: "Product listed successfully.",
            product
        });

    } catch (error) {
        console.error("Error in uploading product.", error);
        res.status(500).json({
            message: "Error in uploading product",
            error: error.message
        });
    }
};
