/**
 * OpenAI Integration Configuration
 * Provides functionality to interact with OpenAI's GPT models for tax-related responses
 */

const { OpenAI } = require('openai');
const { getRedisClient } = require('./database');
const crypto = require('crypto');
const fs = require('fs');

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a hash for a given prompt to use as cache key
const createPromptHash = (prompt) => {
  return crypto.createHash('md5').update(prompt).digest('hex');
};

/**
 * Generate chat completion using OpenAI's API with caching
 * 
 * @param {string} prompt - User's tax-related question
 * @param {object} context - Optional context from previous interactions
 * @param {boolean} useCache - Whether to use Redis cache (default: true)
 * @returns {Promise<object>} - OpenAI response
 */
const generateCompletion = async (prompt, context = {}, useCache = true) => {
  const redisClient = getRedisClient();
  const promptHash = createPromptHash(JSON.stringify({ prompt, context }));
  
  // Check cache if Redis is available and caching is enabled
  if (redisClient && useCache) {
    try {
      const cachedResponse = await redisClient.get(`chat:${promptHash}`);
      if (cachedResponse) {
        console.log('Cache hit for prompt:', promptHash);
        return JSON.parse(cachedResponse);
      }
    } catch (error) {
      console.error('Redis cache error:', error);
      // Continue with API call if caching fails
    }
  }

  try {
    // System prompt to ensure tax-focused responses
    const systemPrompt = `You are a highly knowledgeable AI tax consultant specializing in Indian Tax Regime 2025. 
    Your task is to help users legally minimize their taxes by suggesting the best deductions, 
    exemptions, and investment strategies. Always provide accurate, clear, and personalized advice 
    with reference to the latest Indian tax laws. If you don't know something specific, 
    acknowledge it rather than providing incorrect information.`;

    // Prepare messages array with system prompt, context and user question
    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    // Add previous messages from context if available
    if (context.previousMessages && Array.isArray(context.previousMessages)) {
      messages.push(...context.previousMessages);
    }

    // Add current user prompt
    messages.push({ role: 'user', content: prompt });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Cache the response if Redis is available and caching is enabled
    if (redisClient && useCache) {
      try {
        // Cache for 24 hours (86400 seconds)
        await redisClient.set(
          `chat:${promptHash}`, 
          JSON.stringify(response), 
          'EX', 
          86400
        );
      } catch (error) {
        console.error('Redis caching error:', error);
        // Continue without caching if it fails
      }
    }

    return response;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate AI response');
  }
};

/**
 * Generate streaming chat completion using OpenAI's API
 * 
 * @param {string} prompt - User's tax-related question
 * @param {object} context - Optional context from previous interactions
 * @returns {Promise<ReadableStream>} - OpenAI streaming response
 */
const generateStreamingCompletion = async (prompt, context = {}) => {
  try {
    // System prompt to ensure tax-focused responses
    const systemPrompt = `You are a highly knowledgeable AI tax consultant specializing in Indian Tax Regime 2025. 
    Your task is to help users legally minimize their taxes by suggesting the best deductions, 
    exemptions, and investment strategies. Always provide accurate, clear, and personalized advice 
    with reference to the latest Indian tax laws. If you don't know something specific, 
    acknowledge it rather than providing incorrect information.`;

    // Prepare messages array with system prompt, context and user question
    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    // Add previous messages from context if available
    if (context.previousMessages && Array.isArray(context.previousMessages)) {
      messages.push(...context.previousMessages);
    }

    // Add current user prompt
    messages.push({ role: 'user', content: prompt });

    // Call OpenAI API with streaming enabled
    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
    });

    return stream;
  } catch (error) {
    console.error('OpenAI Streaming API error:', error);
    throw new Error('Failed to generate streaming AI response');
  }
};

/**
 * Fallback to local AI model if OpenAI API is not available
 * 
 * @param {string} prompt - User's tax-related question
 * @returns {Promise<string>} - Local model response
 */
const fallbackToLocalModel = async (prompt) => {
  // Fallback to a locally hosted model (like Llama 3) if configured
  if (process.env.USE_LOCAL_MODEL === 'true') {
    try {
      // Implementation would depend on the local model API
      // This is a placeholder for the actual implementation
      console.log('Falling back to local model for prompt:', prompt);
      return {
        choices: [{
          message: {
            content: "I'm sorry, but I cannot provide a detailed response at the moment. Please try again later or contact a human tax consultant for assistance."
          }
        }]
      };
    } catch (error) {
      console.error('Local model error:', error);
      throw new Error('Failed to generate response from local model');
    }
  }
  
  // If no local model is configured, return a default message
  return {
    choices: [{
      message: {
        content: "I'm sorry, but our AI service is currently unavailable. Please try again later or contact a human tax consultant for assistance."
      }
    }]
  };
};

module.exports = {
  openai,
  generateCompletion,
  generateStreamingCompletion,
  fallbackToLocalModel
}; 