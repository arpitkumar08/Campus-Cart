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
    const products = await Product.find()
      .populate("owner", "fullName email") // populate owner info
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      response: products, // match your frontend expectation
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};


// ✅ Get products listed by the logged-in user
exports.mylistedProducts = async (req, res) => {
  try {
    // Use the logged-in user's ID provided by protect middleware
    const ownerId = req.user._id;


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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get product details by ID
exports.getProductDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id)
      .populate("owner", "fullName email"); // ✅ populate the seller

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({
      message: "Error fetching product details",
      error: error.message,
    });
  }
};

exports.markAsSold = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Mark Sold API called for product ID:", id);

    const product = await Product.findById(id);
    console.log("Fetched product from DB:", product);

    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    // Log req.user for debugging
    console.log("req.user:", req.user);

    // Ownership/admin check
    if (req.user) {
      // Allow admin or the owner
      if (req.user.role !== 'admin' && product.owner.toString() !== req.user.id) {
        console.log("User is not authorized to mark this product as sold");
        return res.status(403).json({ message: "You are not authorized to mark this product as sold" });
      }
    } else {
      // If protect is removed and req.user doesn't exist
      console.log("No user info provided, skipping ownership check");
      // Optional: you can decide to block anonymous marking if needed
      // return res.status(403).json({ message: "Authentication required" });
    }

    // Mark product as sold
    product.status = "sold";
    await product.save();
    console.log("Product marked as sold:", product);

    res.status(200).json({
      message: "Product marked as sold successfully",
      product,
    });

  } catch (error) {
    console.error("Error marking product as sold:", error);
    res.status(500).json({ message: "Server error" });
  }
};

