const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { generateTokenAndSetCookie } = require('../utils/generateTokenAndSetCookie');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../resendEmailVerification/email');

// ✅ Signup Controller (fixed: email normalization + comments)
exports.signup = async (req, res) => {
    // ✅ Normalize and trim inputs
    const fullName = req.body.fullName?.trim();
    const email = req.body.email?.toLowerCase().trim(); // <-- FIXED: lowercase + trim
    const password = req.body.password;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // ✅ Prevent duplicate registration by normalized email
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });

        generateTokenAndSetCookie(res, user._id);

        // Send email after user creation
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully. Verification email sent.",
            user: { ...user._doc, password: undefined },
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// ✅ Login Controller (fixed: email normalization + verification check)
exports.login = async (req, res) => {
    const email = req.body.email?.toLowerCase().trim(); // <-- FIXED: lowercase + trim
    const password = req.body.password;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // ✅ Optional: Block unverified users
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email before logging in.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id);

        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("Error in login:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// ✅ Verify Email Controller (unchanged, good logic)
exports.verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log("error in verifyEmail", error);
        res.status(500).json({ message: "Error verifying email", error: error.message });
    }
};

// ✅ Forgot Password (unchanged except improved comments)
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim(); // <-- FIXED: normalize
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found." });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password reset link sent to your email." });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ success: false, message: "Error sending password reset email.", error: error.message });
    }
};

// ✅ Reset Password (confirmed: pre-save hook handles hashing)
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        user.password = password; // pre-save hook hashes it automatically
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error in reset password", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// ✅ Get Current User (unchanged)
exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(401).json({ success: false, message: "Not authenticated" });
    }
};

// ✅ Logout Controller (unchanged)
exports.logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
};

// ✅ Auth Check (unchanged)
exports.checkAuth = (req, res) => {
    if (req.user) {
        return res.status(200).json({ user: req.user });
    } else {
        return res.status(401).json({ message: "Not authenticated" });
    }
};
