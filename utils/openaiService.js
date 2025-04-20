/**
 * Service for interacting with the OpenAI API
 */

// Mock response for development (if no API key is available)
const mockResponse = "This is a mock response from TaxAI. In a production environment, this would be a real response from the OpenAI API. For now, I'm programmed to tell you that the standard deduction for the 2023 tax year is ₹50,000 for salaried individuals. You can ask me any tax-related questions!";

/**
 * Send a message to OpenAI and get a response
 * @param {string} message - User message
 * @param {Array} previousMessages - Array of previous messages for context
 * @returns {Promise<string>} AI response
 */
export async function sendMessageToOpenAI(message, previousMessages = []) {
  // Check if we're in development mode without API key
  if (!process.env.OPENAI_API_KEY || process.env.NODE_ENV === 'development') {
    console.log('Using mock response in development mode');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockResponse;
  }
  
  const contextMessages = [
    { role: 'system', content: 'You are TaxAI, a helpful assistant for tax-related questions.' },
    ...previousMessages,
    { role: 'user', content: message }
  ];
  
  try {
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
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `OpenAI API returned status ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
} 