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
 * Generates a tax analysis response using OpenAI based on tax data and user prompt
 */
export async function generateTaxAnalysis(
  { prompt, taxResults, taxInputs }: TaxAnalysisRequest
): Promise<TaxAnalysisResponse> {
  if (!config.features.openAiIntegration || !config.openai.apiKey) {
    return {
      analysis: "",
      error: "OpenAI integration is not configured. Set ENABLE_OPENAI_INTEGRATION=true and provide a valid API key."
    };
  }

  try {
    // Format a system prompt with the tax data
    const systemPrompt = `
You are an expert tax consultant specializing in Indian income tax laws. 
You provide clear, accurate, and personalized advice based on the user's tax calculation data.

Current tax calculation data:
- Basic Salary: ${config.formatCurrency(taxInputs.basicSalary || 0)}
- HRA Received: ${config.formatCurrency(taxInputs.hraReceived || 0)}
- Special Allowance: ${config.formatCurrency(taxInputs.specialAllowance || 0)}
- LTA: ${config.formatCurrency(taxInputs.lta || 0)}
- Other Income: ${config.formatCurrency(taxInputs.otherIncome || 0)}
- Rent Paid: ${config.formatCurrency(taxInputs.rentPaid || 0)}
- City Type: ${taxInputs.cityType || 'Not specified'}

Deductions:
- Section 80C: ${config.formatCurrency(taxInputs.section80C || 0)}
- Health Insurance (Self & Family): ${config.formatCurrency(taxInputs.healthInsuranceSelf || 0)}
- Health Insurance (Parents): ${config.formatCurrency(taxInputs.healthInsuranceParents || 0)}
- NPS Additional: ${config.formatCurrency(taxInputs.npsAdditional || 0)}
- Home Loan Interest: ${config.formatCurrency(taxInputs.homeLoanInterest || 0)}

Tax Calculation Results:
- Old Regime Tax: ${config.formatCurrency(taxResults.oldRegime.taxAmount || 0)}
- New Regime Tax: ${config.formatCurrency(taxResults.newRegime.taxAmount || 0)}
- Recommended Regime: ${taxResults.bestRegime === 'old' ? 'Old Regime' : 'New Regime'}
- Tax Savings with Recommended Regime: ${config.formatCurrency(taxResults.savings || 0)}

Current Tax Financial Year: ${config.tax.year}

Provide professional advice that is accurate, concise, and relevant to the user's specific situation.
Avoid generic advice that doesn't apply to their specific tax scenario.
Where applicable, reference specific sections of the Income Tax Act.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.openai.apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 600
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

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