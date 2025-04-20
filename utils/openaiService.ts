import { config } from '@/utils/config';
import { TaxResult, TaxCalculationInput } from '@/utils/taxCalculations';

interface TaxAnalysisRequest {
  prompt: string;
  taxResults: TaxResult;
  taxInputs: TaxCalculationInput;
}

export interface TaxAnalysisResponse {
  analysis: string;
  error?: string;
}

/**
 * Generates a tax analysis response using OpenAI GPT-4 based on tax data and user prompt
 */
export async function generateTaxAnalysis(
  { prompt, taxResults, taxInputs }: TaxAnalysisRequest
): Promise<TaxAnalysisResponse> {
  // Check if OpenAI integration is enabled and API key is available
  if (!config.features.openAiIntegration) {
    return {
      analysis: "",
      error: "OpenAI integration is not enabled. Set ENABLE_OPENAI_INTEGRATION=true in your .env file."
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      analysis: "",
      error: "OpenAI API key is missing. Please add it to your .env file."
    };
  }

  try {
    // Prepare context information about the user's tax situation
    const taxContext = `
Current tax calculation data:
- Basic Salary: ${config.formatCurrency(taxInputs.basicSalary || 0)}
- HRA Received: ${config.formatCurrency(taxInputs.hra || 0)}
- Special Allowance: ${config.formatCurrency(taxInputs.specialAllowance || 0)}
- LTA: ${config.formatCurrency(taxInputs.lta || 0)}
- Other Income: ${config.formatCurrency(taxInputs.otherIncome || 0)}
- Rent Paid: ${config.formatCurrency(taxInputs.rentPaid || 0)}
- City Type: ${taxInputs.cityType || 'Not specified'}

Deductions:
- Section 80C: ${config.formatCurrency(taxInputs.section80C || 0)}
- Health Insurance (Self & Family): ${config.formatCurrency(taxInputs.section80D_self || 0)}
- Health Insurance (Parents): ${config.formatCurrency(taxInputs.section80D_parents || 0)}
- NPS Additional: ${config.formatCurrency(taxInputs.nps || 0)}
- Home Loan Interest: ${config.formatCurrency(taxInputs.homeLoanInterest || 0)}

Tax Calculation Results:
- Old Regime Tax: ${config.formatCurrency(taxResults.oldRegime.taxAmount || 0)}
- New Regime Tax: ${config.formatCurrency(taxResults.newRegime.taxAmount || 0)}
- Recommended Regime: ${taxResults.bestRegime === 'old' ? 'Old Regime' : 'New Regime'}
- Tax Savings with Recommended Regime: ${config.formatCurrency(taxResults.totalSavings || 0)}

Current Tax Financial Year: ${config.tax.year}

The user is asking: "${prompt}"
`;

    // Make the API call to OpenAI chat completions endpoint with GPT-4 model
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { 
            role: "system", 
            content: "You are TaxAI, a helpful assistant that explains Indian tax law clearly and concisely." 
          },
          { 
            role: "user", 
            content: taxContext 
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    // Handle API response errors
    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error details:", errorData);
      
      // Handle rate limiting and quota errors specifically
      if (response.status === 429) {
        return {
          analysis: "",
          error: "Rate limit exceeded. Please try again later."
        };
      }
      
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Status code: ' + response.status}`);
    }

    // Parse and return the AI response
    const data = await response.json();
    return { analysis: data.choices[0].message.content };
  } catch (error) {
    console.error("Error generating tax analysis:", error);
    return {
      analysis: "",
      error: `Failed to generate tax analysis: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
} 