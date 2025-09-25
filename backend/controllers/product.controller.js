const Product = require("../models/product.model");

// ✅ Add a product
exports.addProduct = async (req, res) => {
  try {
    const {
      title,
      category,
      price,
      description,
      isNegotiable,
      condition,
      status = "Available",
      location,
      owner,
    } = req.body;

    const numericPrice = Number(price);
    const negotiable = isNegotiable === "true";
    const images = req.body.images || [];

    // Validate required fields
    if (
      !title ||
      !category ||
      !description ||
      isNaN(numericPrice) ||
      !condition ||
      !location ||
      !owner
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
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
      price: numericPrice,
      description,
      isNegotiable: negotiable,
      images,
      condition,
      status,
      location,
      owner,
    });

    res.status(201).json({
      success: true,
      message: "Product listed successfully.",
      product,
    });
  } catch (error) {
    console.error("Error in uploading product:", error);
    res
      .status(500)
      .json({ message: "Error in uploading product", error: error.message });
  }
};

// ✅ Delete product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Product not found." });

    await Product.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

// ✅ Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// ✅ Get products listed by the logged-in user
exports.mylistedProducts = async (req, res) => {
  try {
    // Use the logged-in user's ID provided by protect middleware
    const ownerId = req.user._id;

    console.log("Fetching my listings for:", ownerId);

    const products = await Product.find({ owner: ownerId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching user listings:", error);
    res
      .status(500)
      .json({ message: "Error fetching user listings", error: error.message });
  }
};
