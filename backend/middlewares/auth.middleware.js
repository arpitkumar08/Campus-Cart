const jwt = require("jsonwebtoken"); // ✅ add this import
const User = require("../models/user.model"); // (if you're fetching user data)


// protect middleware

exports.protect = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No token" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select("-password");
  if (!user) return res.status(401).json({ message: "User not found" });

  req.user = user;
  next();
};
