/**
 * Chat Routes
 * Handles AI interactions and chat management
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');

// Standard chat endpoints (require authentication)
router.post('/', authenticate, chatController.sendMessage);
router.post('/stream', authenticate, chatController.streamResponse);
router.get('/:chatId', authenticate, chatController.getChat);
router.patch('/:chatId', authenticate, chatController.updateChat);
router.delete('/:chatId', authenticate, chatController.deleteChat);
router.post('/:chatId/regenerate', authenticate, chatController.regenerateResponse);

module.exports = router; 