/**
 * Chat Routes
 * Handles AI interactions and chat management
 */

const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { authenticate, optionalAuth } = require('../middleware/auth.middleware');
const { validateChatInput, validateChatId } = require('../middleware/validation.middleware');

// Standard chat endpoints (require authentication)
router.post('/', authenticate, validateChatInput, chatController.sendMessage);
router.post('/stream', authenticate, validateChatInput, chatController.streamResponse);
router.get('/:chatId', authenticate, validateChatId, chatController.getChat);
router.patch('/:chatId', authenticate, validateChatId, chatController.updateChat);
router.delete('/:chatId', authenticate, validateChatId, chatController.deleteChat);
router.post('/:chatId/regenerate', authenticate, validateChatId, chatController.regenerateResponse);

module.exports = router; 