/**
 * Helper functions to build OpenAI prompts for tax-related queries
 */

/**
 * Build a system prompt for OpenAI based on tax regime
 * @param {string} taxRegime - Either 'new' or 'old' tax regime
 * @param {Object} options - Additional options for prompt customization
 * @returns {string} - Formatted system prompt for OpenAI
 */
export function buildTaxSystemPrompt(taxRegime = 'new', options = {}) {
  const { 
    includeTaxRules = true,
    includeExtraContext = false,
    userProfile = null
  } = options;
  
  const fiscalYear = taxRegime === 'new' ? '2025-26' : '2024-25';
  const regimeLabel = taxRegime === 'new' ? 'New' : 'Old';
  
  let prompt = `You are a knowledgeable tax assistant. Reply to the user's tax query in clear, beginner-friendly language. Always include a disclaimer that this is not professional tax advice. Provide answers based on the selected tax regime:
- New Regime: Financial Year 2025–26
- Old Regime: Financial Year 2024–25

You are currently responding about the ${regimeLabel} Regime for Financial Year ${fiscalYear}.`;

  // Add relevant tax rules if specified
  if (includeTaxRules) {
    if (taxRegime === 'new') {
      prompt += `

Key information about the New Tax Regime for 2025-26:
- Standard deduction of ₹50,000 is available
- No House Rent Allowance (HRA) exemption
- No deductions under Section 80C, 80D, etc.
- Tax rebate under Section 87A up to income of ₹7,00,000
- Lower tax rates compared to Old Regime
- Tax Slabs: 0% up to ₹3,00,000, 5% from ₹3-6 lakh, 10% from ₹6-9 lakh, 15% from ₹9-12 lakh, 20% from ₹12-15 lakh, and 30% above ₹15 lakh`;
    } else {
      prompt += `

Key information about the Old Tax Regime for 2024-25:
- Standard deduction of ₹50,000 for salaried individuals
- HRA exemption is available (lowest of: actual HRA, 50% of basic salary in metro cities or 40% in non-metro cities, rent paid minus 10% of basic salary)
- Deductions under Section 80C up to ₹1,50,000
- Deductions under Section 80D up to ₹25,000 for self/family and ₹50,000 for senior citizen parents
- Additional NPS deduction under 80CCD(1B) up to ₹50,000
- Home loan interest deduction up to ₹2,00,000
- Tax Slabs: 0% up to ₹2,50,000, 5% from ₹2.5-5 lakh, 20% from ₹5-10 lakh, and 30% above ₹10 lakh`;
    }
  }
  
  // Add user profile context if provided
  if (userProfile) {
    prompt += `

User's financial profile (for personalized advice):
- Basic Salary: ₹${userProfile.basicSalary.toLocaleString()}
- HRA Received: ₹${userProfile.hra.toLocaleString()}
- Rent Paid: ₹${userProfile.rentPaid.toLocaleString()}
- City Type: ${userProfile.cityType === 'metro' ? 'Metro' : 'Non-Metro'}
- Section 80C Investments: ₹${userProfile.section80C.toLocaleString()}
- Health Insurance Premium: ₹${userProfile.section80D_self.toLocaleString()}`;
  }
  
  // Add extra context for more accurate responses
  if (includeExtraContext) {
    prompt += `

Answer format guidelines:
- Format your response with proper paragraph spacing
- Use bullet points for lists or multiple points
- For numerical examples, show the calculations clearly
- Keep your answers concise yet informative for a general audience
- When explaining tax calculations, break them down step by step
- Cite the relevant sections of the Income Tax Act when appropriate`;
  }
  
  // Final instruction and question placeholder
  prompt += `

Question: `;
  
  return prompt;
}

/**
 * Build a fallback response when API call fails
 * @param {string} message - User's original message
 * @param {string} taxRegime - Selected tax regime
 * @returns {string} Formatted fallback message
 */
export function buildFallbackResponse(message, taxRegime = 'new') {
  const fiscalYear = taxRegime === 'new' ? '2025-26' : '2024-25';
  const truncatedMessage = message.length > 50 ? message.substring(0, 50) + '...' : message;
  
  return `I apologize, but I'm currently unable to process your question about "${truncatedMessage}" for the ${taxRegime === 'new' ? 'New' : 'Old'} Tax Regime (Financial Year ${fiscalYear}).

Please try again later or rephrase your question. You may also want to check the Income Tax Department's official website for accurate information.

⚠️ Remember that this tool provides AI-generated information and not professional tax advice. Please consult a certified tax professional for your specific situation.`;
}

/**
 * Generate a list of preset tax questions based on tax regime
 * @param {string} taxRegime - Selected tax regime
 * @returns {Array} List of preset questions
 */
export function getPresetQuestions(taxRegime = 'new') {
  const commonQuestions = [
    "What is the difference between old and new tax regimes?",
    "How do I file taxes as a freelancer?",
    "What are the documents needed for filing ITR?",
    "When is the last date to file income tax returns?",
    "What happens if I miss the tax filing deadline?"
  ];
  
  const newRegimeQuestions = [
    "What is the tax rebate under Section 87A in new regime?",
    "Do I need to invest in tax-saving instruments under new regime?",
    "How is standard deduction applied in new tax regime?",
    "What are the tax slabs for new regime in FY 2025-26?"
  ];
  
  const oldRegimeQuestions = [
    "What deductions are available under Section 80C?",
    "How do I calculate HRA exemption in old regime?",
    "What is the maximum health insurance premium deduction?",
    "How to claim home loan interest deduction in old regime?"
  ];
  
  return [
    ...commonQuestions,
    ...(taxRegime === 'new' ? newRegimeQuestions : oldRegimeQuestions)
  ];
} 