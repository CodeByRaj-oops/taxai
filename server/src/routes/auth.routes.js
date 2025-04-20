/**
 * Authentication Routes
 * Handles user registration, login, logout, and password management
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:resetToken', authController.resetPassword);

// Protected routes - require authentication
router.get('/me', authenticate, authController.getMe);
router.patch('/update-password', authenticate, authController.updatePassword);

module.exports = router; 