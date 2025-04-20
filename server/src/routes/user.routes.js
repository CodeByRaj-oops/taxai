/**
 * User Routes
 * Handles user profile, preferences, and chat history
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Profile management
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.patch('/preferences', userController.updatePreferences);
router.patch('/tax-profile', userController.updateTaxProfile);

// Chat history
router.get('/chats', userController.getChatHistory);

// Account management
router.delete('/', userController.deleteAccount);

module.exports = router; 