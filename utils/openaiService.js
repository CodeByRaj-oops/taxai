/**
 * Service for interacting with the OpenAI API
 * This file should only be imported by backend API routes, never directly used in client-side code
 */

// Mock response for development (if no API key is available)
const mockResponse = "This is a mock response from TaxAI. In a production environment, this would be a real response from the OpenAI API. For now, I'm programmed to tell you that the standard deduction for the 2023 tax year is ₹50,000 for salaried individuals. You can ask me any tax-related questions!\n\n⚠️ This is AI-generated and not professional tax advice. Please consult a certified tax professional.";

/**
 * Send a message to OpenAI and get a response
 * @param {string} message - User message
 * @param {string} taxRegime - Selected tax regime (old or new)
 * @param {Array} previousMessages - Array of previous messages for context
 * @returns {Promise<string>} AI response
 */
export async function sendMessageToOpenAI(message, taxRegime = 'new', previousMessages = []) {
  // Check if we're in development mode without API key
  if (!process.env.OPENAI_API_KEY) {
    console.log('Using mock response (missing API key)');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      text: mockResponse,
      success: true
    };
  }

  const prompt = buildSystemPrompt(taxRegime);
  
  const contextMessages = [
    { role: 'system', content: prompt },
    ...previousMessages,
    { role: 'user', content: message }
  ];
  
  try {
    console.log('Sending request to OpenAI API');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: contextMessages,
        temperature: 0.7,
        max_tokens: 800
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      
      // Return structured error response
      return {
        text: getFallbackResponse(message, taxRegime),
        success: false,
        error: errorData.error?.message || `API error: ${response.status}`
      };
    }
    
    const data = await response.json();
    return {
      text: data.choices[0].message.content,
      success: true
    };
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    return {
      text: getFallbackResponse(message, taxRegime),
      success: false,
      error: error.message || 'Failed to connect to AI service'
    };
  }
}

/**
 * Build the system prompt for OpenAI based on tax regime
 * @param {string} taxRegime - Selected tax regime (old or new)
 * @returns {string} System prompt
 */
function buildSystemPrompt(taxRegime) {
  const fiscalYear = taxRegime === 'new' ? '2025-26' : '2024-25';
  
  return `You are a knowledgeable tax assistant. Reply to the user's tax query in clear, beginner-friendly language. Always include a disclaimer that this is not professional tax advice. Provide answers based on the selected tax regime:
- New Regime: Financial Year 2025–26
- Old Regime: Financial Year 2024–25

You are currently responding about the ${taxRegime === 'new' ? 'New' : 'Old'} Regime for Financial Year ${fiscalYear}.

Format your response with proper paragraph spacing. Use bullet points for lists or steps.
Keep your answers concise yet informative for a general audience.

Question: `;
}

/**
 * Get a fallback response when OpenAI API fails
 * @param {string} message - User message
 * @param {string} taxRegime - Selected tax regime
 * @returns {string} Fallback response
 */
function getFallbackResponse(message, taxRegime) {
  const fiscalYear = taxRegime === 'new' ? '2025-26' : '2024-25';
  
  return `I apologize, but I'm currently unable to process your question about "${message.substring(0, 50)}..." for the ${taxRegime === 'new' ? 'New' : 'Old'} Tax Regime (Financial Year ${fiscalYear}).

Please try again later or rephrase your question. You may also want to check the Income Tax Department's official website for accurate information.

⚠️ Remember that this tool provides AI-generated information and not professional tax advice. Please consult a certified tax professional for your specific situation.`;
} 