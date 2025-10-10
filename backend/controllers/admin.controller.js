const User = require("../models/user.model");
const Product = require('../models/product.model')
const Report = require('../models/report.model')


// Controller to get total users
const getUsersCount = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        res.json({ count: totalUsers });
    } catch (error) {
        console.error("Error counting users:", error);
        res.status(500).json({ message: "Error counting users", error });
    }
};


const getProductsCount = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        res.json({ count: totalProducts })
    } catch (error) {
        console.error("Error counting products: ", error)
        res.status(500).json({ message: "Error counting products", error });

    }
}

const getReportedProductCount = async (req, res) => {
    try {
        const totalReportedProducts = await Report.countDocuments();
        res.json({ count: totalReportedProducts })
    } catch (error) {
        console.error("Error counting reproted products: ", error)
        res.status(500).json({ message: "Error counting reproted products", error });

    }
}

// You can add more controllers here later, e.g., packages, orders, chart data

module.exports = { getUsersCount, getProductsCount, getReportedProductCount };
