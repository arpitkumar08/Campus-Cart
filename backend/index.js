const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.route');
const connectDB = require('./db/connectDB')

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // ✅ Add this before routes

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
