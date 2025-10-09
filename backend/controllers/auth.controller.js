const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { generateTokenAndSetCookie } = require('../utils/generateTokenAndSetCookie');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../resendEmailVerification/email');

// ✅ Signup Controller
exports.signup = async (req, res) => {
    const fullName = req.body.fullName?.trim();
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password?.trim();

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "Email already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(hashedPassword);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
            isVerified: false,
        });

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully. Please verify your email before logging in.",
            user: { ...user._doc, password: undefined },
        });
    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(500).json({ success: false, message: "Error registering user.", error: error.message });
    }
};

// ✅ Login Controller
exports.login = async (req, res) => {
    const email = req.body.email?.toLowerCase().trim();
    const password = req.body.password?.trim();



    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials." });
        }



        console.log("Entered password:", `${password}`);
        console.log("DB hashed password:", user.password);


        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: "Please verify your email before logging in." });
        }

        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password valid?", isPasswordValid);
  
        console.log("Password valid?", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials." });
        }

        const token = generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully.",
            token,
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// ✅ Verify Email Controller
exports.verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            user: { ...user._doc, password: undefined }
        });
    } catch (error) {
        console.error("Verify Email Error:", error.message);
        res.status(500).json({ success: false, message: "Error verifying email.", error: error.message });
    }
};

// ✅ Forgot Password Controller
exports.forgotPassword = async (req, res) => {
    const email = req.body.email?.toLowerCase().trim();
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "User not found." });

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email." });
    } catch (error) {
        console.error("Forgot Password Error:", error.message);
        res.status(500).json({ success: false, message: "Error sending password reset email.", error: error.message });
    }
};

// ✅ Reset Password Controller
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const password = req.body.password?.trim();

    try {
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ success: false, message: "Invalid or expired reset token." });

        user.password = await bcrypt.hash(password, 10); // ✅ explicit hashing
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully." });
    } catch (error) {
        console.error("Reset Password Error:", error.message);
        res.status(500).json({ success: false, message: "Error resetting password.", error: error.message });
    }
};

// ✅ Get Current User Controller
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(401).json({ success: false, message: "Not authenticated." });
    }
};

// ✅ Logout Controller
exports.logout = async (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true });
    res.status(200).json({ success: true, message: "Logout successful." });
};

// ✅ Auth Check Controller
exports.checkAuth = (req, res) => {
    if (req.user) {
        return res.status(200).json({ success: true, user: req.user });
    }
    return res.status(401).json({ success: false, message: "Not authenticated." });
};
