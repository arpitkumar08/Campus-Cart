const User = require('../models/user.model');
const bcrypt = require('bcrypt'); // for hashing passwords
const crypto = require('crypto')
const jwt = require('jsonwebtoken'); // for authentication tokens
const { generateTokenAndSetCookie } = require('../utils/generateTokenAndSetCookie');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../resendEmailVerification/email');

// Signup controller
exports.signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

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

// Login controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password: password ? "******" : null });

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log("Login failed: User not found for email:", email);
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        console.log("User found:", { id: user._id, email: user.email });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Login failed: Password mismatch for email:", email);
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        console.log("Password matched for user:", email);

        generateTokenAndSetCookie(res, user._id);
        console.log("JWT token generated and cookie set for user:", email);

        user.lastLogin = new Date();
        await user.save();
        console.log("User lastLogin updated:", user.lastLogin);

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


// Verify Email
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
        console.log("error in verifyEmail", error)
        res.status(500).json({ message: "Error verifying email", error: error.message });
    }
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required." });
    }

    try {
        const user = await User.findOne({ email });

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

        // ❌ Don't hash manually, let the pre-save hook do it
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error in reset password", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Logout controller (optional, just for client-side token removal)
exports.logout = async (req, res) => {
    // Usually handled on client by deleting JWT token
    res.clearCookie("token")
    res.status(200).json({ message: "Logout successful" });
};


