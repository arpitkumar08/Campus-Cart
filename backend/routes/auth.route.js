// backend/routes/auth.route.js
const express = require('express');
const router = express.Router();
const { signup, login, logout, verifyEmail, forgotPassword, resetPassword } = require('../controllers/auth.controller'); // CommonJS

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.post('/logout', logout)

module.exports = router;
