const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for frontend requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.static('public')); // Serve static files from public directory

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Tax calculation endpoint - static response for now
app.post('/api/tax/calculate', (req, res) => {
  try {
    const { taxInputs } = req.body;
    
    if (!taxInputs) {
      return res.status(400).json({ error: 'Tax input data is required' });
    }

    // Format currency for display
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(amount || 0);
    };

    // Basic tax calculation logic (simplified)
    const calculateTax = (income, regime) => {
      // This is a simplified calculation - real calculations would be more complex
      if (regime === 'old') {
        if (income <= 250000) return 0;
        else if (income <= 500000) return (income - 250000) * 0.05;
        else if (income <= 1000000) return 12500 + (income - 500000) * 0.2;
        else return 112500 + (income - 1000000) * 0.3;
      } else { // new regime
        if (income <= 300000) return 0;
        else if (income <= 600000) return (income - 300000) * 0.05;
        else if (income <= 900000) return 15000 + (income - 600000) * 0.1;
        else if (income <= 1200000) return 45000 + (income - 900000) * 0.15;
        else if (income <= 1500000) return 90000 + (income - 1200000) * 0.2;
        else return 150000 + (income - 1500000) * 0.3;
      }
    };

    // Calculate gross income
    const grossIncome = (taxInputs.basicSalary || 0) + 
                        (taxInputs.hra || 0) + 
                        (taxInputs.specialAllowance || 0) + 
                        (taxInputs.lta || 0) + 
                        (taxInputs.otherIncome || 0);

    // Calculate old regime tax
    const standardDeduction = 50000;
    let oldRegimeTaxableIncome = grossIncome - standardDeduction;

    // Apply deductions for old regime
    const oldRegimeDeductions = (taxInputs.section80C || 0) + 
                               (taxInputs.section80D_self || 0) + 
                               (taxInputs.section80D_parents || 0) + 
                               (taxInputs.nps || 0) + 
                               (taxInputs.homeLoanInterest || 0);
    
    oldRegimeTaxableIncome = Math.max(0, oldRegimeTaxableIncome - oldRegimeDeductions);
    const oldRegimeTax = calculateTax(oldRegimeTaxableIncome, 'old');
    const oldRegimeCess = oldRegimeTax * 0.04; // 4% cess
    const oldRegimeTotalTax = oldRegimeTax + oldRegimeCess;

    // Calculate new regime tax
    let newRegimeTaxableIncome = grossIncome - standardDeduction;
    const newRegimeTax = calculateTax(newRegimeTaxableIncome, 'new');
    const newRegimeCess = newRegimeTax * 0.04; // 4% cess
    const newRegimeTotalTax = newRegimeTax + newRegimeCess;

    // Determine best regime
    const bestRegime = oldRegimeTotalTax <= newRegimeTotalTax ? 'old' : 'new';
    const taxSavings = Math.abs(oldRegimeTotalTax - newRegimeTotalTax);

    // Prepare response
    const taxResults = {
      oldRegime: {
        grossIncome,
        deductions: oldRegimeDeductions + standardDeduction,
        taxableIncome: oldRegimeTaxableIncome,
        taxAmount: oldRegimeTotalTax,
        netIncome: grossIncome - oldRegimeTotalTax
      },
      newRegime: {
        grossIncome,
        deductions: standardDeduction, // Only standard deduction in new regime
        taxableIncome: newRegimeTaxableIncome,
        taxAmount: newRegimeTotalTax,
        netIncome: grossIncome - newRegimeTotalTax
      },
      bestRegime,
      totalSavings: taxSavings
    };

    res.json({ taxResults });
    
  } catch (error) {
    console.error('Error calculating tax:', error);
    res.status(500).json({
      error: 'Failed to calculate tax. Please try again later.',
    });
  }
});

// Tax regime information endpoint
app.get('/api/tax/regimes', (req, res) => {
  res.json({
    regimes: [
      {
        id: 'old',
        name: 'Old Regime',
        fiscalYear: 'FY 2024-25',
        slabs: [
          { limit: 250000, rate: 0 },
          { limit: 500000, rate: 5 },
          { limit: 1000000, rate: 20 },
          { limit: Infinity, rate: 30 }
        ],
        deductions: [
          { code: '80C', name: 'Section 80C', limit: 150000, description: 'Investments such as PPF, ELSS, etc.' },
          { code: '80D', name: 'Health Insurance', limit: 25000, description: 'Health insurance premiums' }
        ]
      },
      {
        id: 'new',
        name: 'New Regime',
        fiscalYear: 'FY 2025-26',
        slabs: [
          { limit: 300000, rate: 0 },
          { limit: 600000, rate: 5 },
          { limit: 900000, rate: 10 },
          { limit: 1200000, rate: 15 },
          { limit: 1500000, rate: 20 },
          { limit: Infinity, rate: 30 }
        ],
        deductions: [
          { code: 'std', name: 'Standard Deduction', limit: 50000, description: 'Fixed deduction for all taxpayers' }
        ]
      }
    ]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 