const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.protect = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.userId) return res.status(401).json({ message: "Invalid token" });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // attach user object to request
    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    if (error.name === "TokenExpiredError") return res.status(401).json({ message: "Token expired, please log in again" });
    if (error.name === "JsonWebTokenError") return res.status(401).json({ message: "Invalid token" });

    res.status(500).json({ message: "Server error in authentication" });
  }
};

exports.verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin only" });
  }
  next();
};
