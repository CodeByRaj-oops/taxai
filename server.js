const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Configure OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(bodyParser.json()); // Parse JSON request bodies

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// OpenAI Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, taxData } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Format the user's tax data for the AI context
    let taxContext = '';
    if (taxData) {
      const { taxInputs, taxResults } = taxData;
      
      // Format currency for display
      const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(amount || 0);
      };

      taxContext = `
Current tax calculation data:
- Basic Salary: ${formatCurrency(taxInputs?.basicSalary)}
- HRA Received: ${formatCurrency(taxInputs?.hra)}
- Special Allowance: ${formatCurrency(taxInputs?.specialAllowance)}
- LTA: ${formatCurrency(taxInputs?.lta)}
- Other Income: ${formatCurrency(taxInputs?.otherIncome)}
- Rent Paid: ${formatCurrency(taxInputs?.rentPaid)}
- City Type: ${taxInputs?.cityType || 'Not specified'}

Deductions:
- Section 80C: ${formatCurrency(taxInputs?.section80C)}
- Health Insurance (Self & Family): ${formatCurrency(taxInputs?.section80D_self)}
- Health Insurance (Parents): ${formatCurrency(taxInputs?.section80D_parents)}
- NPS Additional: ${formatCurrency(taxInputs?.nps)}
- Home Loan Interest: ${formatCurrency(taxInputs?.homeLoanInterest)}

Tax Calculation Results:
- Old Regime Tax: ${formatCurrency(taxResults?.oldRegime?.taxAmount)}
- New Regime Tax: ${formatCurrency(taxResults?.newRegime?.taxAmount)}
- Recommended Regime: ${taxResults?.bestRegime === 'old' ? 'Old Regime' : 'New Regime'}
- Tax Savings with Recommended Regime: ${formatCurrency(taxResults?.totalSavings)}

The user is asking: "${message}"
`;
    } else {
      taxContext = message;
    }

    // Call OpenAI API with GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are TaxAI, an expert in Indian tax law." 
        },
        { 
          role: "user", 
          content: taxContext 
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Send the AI's response back to client
    res.json({ 
      reply: completion.choices[0].message.content 
    });
    
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    // Handle different types of errors
    if (error.response) {
      // OpenAI API error
      res.status(error.response.status).json({
        error: `OpenAI API error: ${error.response.data.error.message}`,
      });
    } else {
      // Other errors
      res.status(500).json({
        error: 'Failed to generate tax analysis. Please try again later.',
      });
    }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`OpenAI API Key is ${process.env.OPENAI_API_KEY ? 'configured' : 'missing'}`);
}); 