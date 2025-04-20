/**
 * OpenAI Service for TaxAI Chat - Handles all interactions with the OpenAI API
 */

import { Configuration, OpenAIApi } from "openai";
import { buildTaxSystemPrompt, buildFallbackResponse } from "../../../utils/helpers/buildPrompt.js";
import dotenv from "dotenv";
import { redisClient } from "../config/redis.js";

dotenv.config();

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Cache TTL in seconds (24 hours)
const CACHE_TTL = 86400;

/**
 * Generate a response from OpenAI based on user message and tax regime
 * @param {string} message - User message
 * @param {string} taxRegime - Tax regime (new or old)
 * @param {Object} userProfile - Optional user financial profile for context
 * @returns {Object} - Response object with success status and data
 */
export const generateAIResponse = async (message, taxRegime = "new", userProfile = null) => {
  try {
    // Check if we're in dev mode without API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-api-key") {
      console.warn("No valid OpenAI API key provided. Using mock response.");
      return getMockResponse(message, taxRegime);
    }

    // Check cache for this query
    const cacheKey = `openai:${taxRegime}:${message.toLowerCase().trim()}`;
    const cachedResponse = await redisClient.get(cacheKey);
    
    if (cachedResponse) {
      console.log("Cache hit for query:", message);
      return JSON.parse(cachedResponse);
    }

    // Build the system prompt based on tax regime and user context
    const systemPrompt = buildTaxSystemPrompt(taxRegime, {
      includeTaxRules: true,
      includeExtraContext: true,
      userProfile
    });

    // Make request to OpenAI
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    // Extract AI response
    const aiResponse = response.data.choices[0].message.content;
    
    // Create response object
    const responseObj = {
      success: true,
      data: {
        message: aiResponse,
        taxRegime,
        query: message,
        timestamp: new Date().toISOString()
      }
    };

    // Cache the response
    await redisClient.set(
      cacheKey, 
      JSON.stringify(responseObj),
      'EX',
      CACHE_TTL
    );

    return responseObj;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return {
      success: false,
      error: {
        message: error.message || "Failed to generate response",
        details: error.response?.data || error,
      },
      data: {
        message: buildFallbackResponse(message, taxRegime),
        taxRegime,
        query: message,
        timestamp: new Date().toISOString(),
        isFallback: true
      }
    };
  }
};

/**
 * Generate a streaming response from OpenAI
 * @param {string} message - User message
 * @param {string} taxRegime - Tax regime (new or old)
 * @param {Object} res - Express response object for streaming
 * @returns {void}
 */
export const streamAIResponse = async (message, taxRegime = "new", res) => {
  try {
    // Check if we're in dev mode without API key
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your-api-key") {
      console.warn("No valid OpenAI API key provided. Using mock response.");
      const mockResponse = getMockResponse(message, taxRegime);
      
      // Simulate streaming with the mock response
      res.write('data: {"text": "' + mockResponse.data.message.replace(/\n/g, "\\n") + '"}\n\n');
      res.write('data: [DONE]\n\n');
      return;
    }

    // Build the system prompt
    const systemPrompt = buildTaxSystemPrompt(taxRegime, {
      includeTaxRules: true,
      includeExtraContext: true
    });

    // Make streaming request to OpenAI
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    // Set up SSE response headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Process the streaming response
    for await (const chunk of response.data) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: {"text": "${content.replace(/\n/g, "\\n")}"}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
  } catch (error) {
    console.error("Error streaming AI response:", error);
    
    // Send fallback response in case of error
    const fallbackMessage = buildFallbackResponse(message, taxRegime);
    res.write(`data: {"error": true, "text": "${fallbackMessage.replace(/\n/g, "\\n")}"}\n\n`);
    res.write('data: [DONE]\n\n');
  } finally {
    res.end();
  }
};

/**
 * Get a mock response for development environments without API key
 * @param {string} message - User message
 * @param {string} taxRegime - Tax regime
 * @returns {Object} - Mock response object
 */
const getMockResponse = (message, taxRegime) => {
  const fiscalYear = taxRegime === 'new' ? '2025-26' : '2024-25';
  
  return {
    success: true,
    data: {
      message: `This is a mock response for development. You asked about "${message}" for the ${taxRegime === 'new' ? 'New' : 'Old'} Tax Regime (Financial Year ${fiscalYear}).

To get actual responses, please configure your OpenAI API key in the .env file.

Here's what you might get in a real response:

${message.toLowerCase().includes('tax') ? `
Based on the ${taxRegime} tax regime, your tax calculation would depend on various factors including your income, deductions, and exemptions.

Under the ${taxRegime === 'new' ? 'New' : 'Old'} Tax Regime for ${fiscalYear}, ${taxRegime === 'new' ? 'you get a simplified structure with lower tax rates but fewer deductions' : 'you get more deductions but potentially higher tax rates'}.

⚠️ Disclaimer: This is not professional tax advice. Please consult a certified tax professional for your specific situation.` : `
I'm a tax assistant focused on Indian tax regulations. I can help with questions about income tax calculation, deductions, tax-saving investments, and filing procedures for both the Old and New tax regimes.

⚠️ Disclaimer: This is not professional tax advice. Please consult a certified tax professional for your specific situation.`}`,
      taxRegime,
      query: message,
      timestamp: new Date().toISOString(),
      isMock: true
    }
  };
};

export default {
  generateAIResponse,
  streamAIResponse
}; 