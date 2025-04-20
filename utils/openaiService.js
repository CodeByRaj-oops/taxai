/**
 * Service for interacting with the OpenAI API
 */

// Fallback mock response if the API call fails
const mockResponse = "This is a mock response from TaxAI. In a production environment, this would be a real response from the OpenAI API. For now, I'm programmed to tell you that the standard deduction for the 2023 tax year is ₹50,000 for salaried individuals. You can ask me any tax-related questions!";

/**
 * Send a message to OpenAI and get a response
 * @param {string} message - User message
 * @param {Array} previousMessages - Array of previous messages for context
 * @returns {Promise<string>} AI response
 */
export async function sendMessageToOpenAI(message, previousMessages = []) {
  // Check if API key is configured
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('No OpenAI API key found, using mock response');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockResponse;
  }
  
  const contextMessages = [
    { role: 'system', content: 'You are TaxAI, a helpful assistant for tax-related questions about Indian taxation.' },
    ...previousMessages,
    { role: 'user', content: message }
  ];
  
  try {
    console.log('Sending request to OpenAI API');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: contextMessages,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || `OpenAI API returned status ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    // If we're in development mode, return a mock response instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log('Falling back to mock response due to API error');
      return `[API Error] ${error.message}\n\n${mockResponse}`;
    }
    
    throw error;
  }
} 