// backend/routes/auth.route.js
const express = require('express');
const router = express.Router();
const { signup, login, logout, verifyEmail, forgotPassword, resetPassword, checkAuth } = require('../controllers/auth.controller'); // CommonJS
const { protect } = require('../middlewares/auth.middleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-email', verifyEmail)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.get('/check-auth', protect, checkAuth)
router.post('/logout', logout)

module.exports = router;
