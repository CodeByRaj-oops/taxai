/**
 * Chat API Route
 * Handles sending messages to OpenAI and returning responses
 */
import { sendMessageToOpenAI } from '../../utils/openaiService';
import { rateLimit } from '../../utils/rateLimit';

// Maximum allowed message length
const MAX_MESSAGE_LENGTH = 500;

/**
 * Validate a chat message
 * @param {string} message - Message to validate
 * @returns {Object} Validation result
 */
function validateMessage(message) {
  if (!message || typeof message !== 'string') {
    return { valid: false, error: 'Message is required' };
  }
  
  const trimmedMessage = message.trim();
  
  if (!trimmedMessage) {
    return { valid: false, error: 'Message cannot be empty' };
  }
  
  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return { 
      valid: false, 
      error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters` 
    };
  }
  
  return { valid: true, message: trimmedMessage };
}

/**
 * Handle errors with a consistent format
 * @param {Object} res - Response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 */
function handleError(res, message, statusCode = 500) {
  return res.status(statusCode).json({
    error: message
  });
}

// Main API handler without rate limiting for now
async function handler(req, res) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return handleError(res, 'Method not allowed', 405);
  }
  
  try {
    const { message } = req.body;
    
    // Validate the message
    const validation = validateMessage(message);
    if (!validation.valid) {
      return handleError(res, validation.error, 400);
    }
    
    // Call OpenAI
    const reply = await sendMessageToOpenAI(validation.message);
    
    // Return the response
    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific errors
    if (error.message?.includes('rate limit')) {
      return handleError(res, 'OpenAI rate limit exceeded. Please try again later.', 429);
    }
    
    if (error.message?.includes('invalid_api_key')) {
      return handleError(res, 'API key error. Please contact support.', 500);
    }
    
    // Generic error
    return handleError(res, 'Failed to get a response from the AI service. Please try again.', 500);
  }
}

// Export the handler with rate limiting applied
// Commenting out rate limiting for now to simplify debugging
// export default rateLimit.withRateLimit(handler);
export default handler; 