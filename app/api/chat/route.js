/**
 * Chat API Route (App Router format)
 * Handles sending messages to OpenAI and returning responses
 */
import { NextResponse } from 'next/server';
import { sendMessageToOpenAI } from '../../../utils/openaiService';
import { rateLimit } from '../../../utils/rateLimit';

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
 * Create an error response with consistent format
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 */
function createErrorResponse(message, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Handle POST requests to /api/chat
 * App Router API routes use HTTP method-named functions
 */
export async function POST(request) {
  try {
    // Get client IP for rate limiting
    // Note: In App Router, IP is available on request.ip
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limit
    const rateLimitResult = rateLimit.check(ip);
    
    // If rate limited, return error
    if (rateLimitResult.isRateLimited) {
      return createErrorResponse(rateLimitResult.message, rateLimitResult.statusCode);
    }
    
    // Parse request body
    const body = await request.json();
    const { message } = body;
    
    // Validate the message
    const validation = validateMessage(message);
    if (!validation.valid) {
      return createErrorResponse(validation.error, 400);
    }
    
    console.log(`Processing message: ${validation.message.substring(0, 50)}...`);
    
    // Call OpenAI
    const reply = await sendMessageToOpenAI(validation.message);
    
    // Return the response
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific errors
    if (error.message?.includes('rate limit')) {
      return createErrorResponse('OpenAI rate limit exceeded. Please try again later.', 429);
    }
    
    if (error.message?.includes('invalid_api_key')) {
      return createErrorResponse('API key error. Please contact support.', 500);
    }
    
    // Generic error
    return createErrorResponse('Failed to get a response from the AI service. Please try again.', 500);
  }
} 