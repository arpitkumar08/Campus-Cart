
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

const getUserGrowth = async (req, res) => {
    try {
        const growth = await User.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    users: { $sum: 1 },
                }
            }
        ])
        const formatted = growth.map(g => ({
            month: new Date(0, g._id - 1).toLocaleString("default", { month: "short" }),
            users: g.users,
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Error fetching user growth:", error);
        res.status(500).json({ message: "Error fetching user growth", error: error.message });
    }
}


const getProductGrowth = async (req, res) => {
    try {
        const growth = await Product.aggregate([
            { $group: { _id: { $month: "$createdAt" }, products: { $sum: 1 } } },
            { $sort: { "_id": 1 } },
        ]);


        const formatted = growth.map(g => ({
            month: new Date(0, g._id - 1).toLocaleString("default", { month: "short" }),
            products: g.products,
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Error fetching product growth:", error);
        res.status(500).json({ message: "Error fetching product growth", error: error.message });
    }
};


const getProductByCategory = async (req, res) => {
    try {
        const categories = await Product.aggregate([
            { $group: { _id: "$category", value: { $sum: 1 } } }
        ])

        const formatted = categories.map(c => ({
            name: c._id || "Uncategorized",
            value: c.value,
        }))

        res.json(formatted)

    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ message: "Error fetching products by category", error: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } })
            .select("fullName email createdAt lastLogin _id") // only send useful fields
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}

const deleteUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied, admin only" });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ✅ Edit user (optional)
const updateUser = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied, admin only" });
        }

        const { name, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true }
        );

        if (!updatedUser)
            return res.status(404).json({ message: "User not found" });

        res.status(200).json({ success: true, updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



module.exports = { getUsersCount, getProductsCount, getReportedProductCount, getUserGrowth, getProductGrowth, getProductByCategory, getAllUsers, deleteUser, updateUser };
