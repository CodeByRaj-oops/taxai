/**
 * Validation Middleware
 * Handles input validation for API endpoints
 */

const { ApiError } = require('./error.middleware');

/**
 * Validate chat message input
 * Ensures message meets length requirements and is not empty
 */
exports.validateChatInput = (req, res, next) => {
  try {
    const { message } = req.body;
    
    // Check if message exists
    if (!message) {
      return next(new ApiError('Message is required', 400));
    }
    
    // Check message length (max 500 characters)
    if (message.length > 500) {
      return next(new ApiError('Message exceeds maximum length of 500 characters', 400));
    }
    
    // Validate tax regime if provided
    if (req.body.taxRegime && !['old', 'new'].includes(req.body.taxRegime)) {
      return next(new ApiError('Invalid tax regime. Must be "old" or "new"', 400));
    }
    
    next();
  } catch (error) {
    next(new ApiError('Invalid input data', 400));
  }
};

/**
 * Validate chat ID parameter
 * Ensures the chat ID is in a valid format
 */
exports.validateChatId = (req, res, next) => {
  try {
    const { chatId } = req.params;
    
    // Check if chatId exists and is a valid format (simple check for MongoDB ObjectId)
    if (!chatId || !chatId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(new ApiError('Invalid chat ID', 400));
    }
    
    next();
  } catch (error) {
    next(new ApiError('Invalid chat ID', 400));
  }
}; 