/**
 * Alternative Express Server on a Different Port
 */
const express = require('express');
const app = express();
const http = require('http');
const PORT = 8888;
const path = require('path');
const fs = require('fs');

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Handle favicon requests to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // Return "No Content" status
});

// Root endpoint - serve HTML
app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health endpoint
app.get('/health', (req, res) => {
  console.log('Health endpoint hit');
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI chat endpoint
app.post('/api/chat', (req, res) => {
  console.log('AI chat endpoint hit', req.body);
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      error: 'Message is required'
    });
  }
  
  // Sample AI responses for demo purposes
  const aiResponses = {
    "tax": "Indian income tax is calculated based on your income and applicable deductions. The tax slabs vary between the old and new tax regimes.",
    "deduction": "Common tax deductions in India include Section 80C investments (up to ₹1.5 lakhs), health insurance premiums under 80D, and home loan interest under 24B.",
    "regime": "India has two tax regimes: the Old regime with deductions and exemptions, and the New regime with lower tax rates but fewer deductions.",
    "deadline": "The deadline for filing income tax returns in India is typically July 31st, though it may be extended in certain circumstances.",
    "penalty": "Late filing of tax returns can result in penalties ranging from ₹5,000 to ₹10,000 depending on the delay.",
    "80c": "Section 80C allows deductions up to ₹1.5 lakhs for investments in PPF, ELSS, life insurance premiums, and other specified instruments.",
    "hra": "House Rent Allowance (HRA) exemption is calculated as the minimum of: actual HRA received, 50% of salary (for metro cities) or 40% (for non-metros), or actual rent paid minus 10% of salary.",
    "nps": "National Pension System (NPS) contributions can give you additional tax benefits under Section 80CCD(1B) up to ₹50,000 beyond the ₹1.5 lakh limit of 80C.",
    "tds": "Tax Deducted at Source (TDS) is a method where tax is collected at the source of income. The deductor deducts a certain percentage before paying the balance to the receiver.",
    "form 16": "Form 16 is a certificate issued by employers detailing the TDS deducted from an employee's salary and deposited with the government during a financial year."
  };
  
  // Simple response generation
  let response = null;
  
  // Check for keywords in the message
  for (const [keyword, reply] of Object.entries(aiResponses)) {
    if (message.toLowerCase().includes(keyword.toLowerCase())) {
      response = reply;
      break;
    }
  }
  
  // Default responses if no keyword matched
  if (!response) {
    const defaultResponses = [
      "I'm not sure I understand your question. Could you rephrase it or ask something about Indian tax laws, deductions, or tax regimes?",
      "That's a great question! However, it's a bit outside my current knowledge. I can help with questions about income tax, deductions, tax regimes, or filing deadlines.",
      "For that specific question, you might want to consult a tax professional. I can help with general tax questions related to Indian taxation.",
      "I can answer questions about Indian tax laws, deductions like 80C, HRA, and tax filing. Could you ask something in these areas?"
    ];
    
    // Return a random default response
    response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }
  
  // Return the AI response
  res.json({
    success: true,
    data: {
      message: response,
      timestamp: new Date().toISOString()
    }
  });
});

// Demo tax calculation endpoint
app.post('/api/demo/calculate', (req, res) => {
  console.log('Tax calculation endpoint hit', req.body);
  // Simple mock calculation
  const { income = 1000000, investments = 150000, hraExemption = 60000 } = req.body;
  
  // Old regime calculation (simplified)
  const oldRegimeTax = calculateOldRegimeTax(income, investments, hraExemption);
  
  // New regime calculation (simplified)
  const newRegimeTax = calculateNewRegimeTax(income);
  
  res.json({
    success: true,
    data: {
      income,
      oldRegime: {
        taxableIncome: income - investments - hraExemption,
        taxAmount: oldRegimeTax,
        netIncome: income - oldRegimeTax
      },
      newRegime: {
        taxableIncome: income,
        taxAmount: newRegimeTax,
        netIncome: income - newRegimeTax
      },
      recommendation: oldRegimeTax < newRegimeTax ? 'OLD_REGIME' : 'NEW_REGIME'
    }
  });
});

// Simple tax calculation functions
function calculateOldRegimeTax(income, investments, hra) {
  const taxableIncome = Math.max(0, income - Math.min(investments, 150000) - hra);
  let tax = 0;
  
  if (taxableIncome <= 250000) {
    tax = 0;
  } else if (taxableIncome <= 500000) {
    tax = (taxableIncome - 250000) * 0.05;
  } else if (taxableIncome <= 1000000) {
    tax = 12500 + (taxableIncome - 500000) * 0.2;
  } else {
    tax = 112500 + (taxableIncome - 1000000) * 0.3;
  }
  
  return Math.round(tax);
}

function calculateNewRegimeTax(income) {
  let tax = 0;
  
  if (income <= 300000) {
    tax = 0;
  } else if (income <= 600000) {
    tax = (income - 300000) * 0.05;
  } else if (income <= 900000) {
    tax = 15000 + (income - 600000) * 0.1;
  } else if (income <= 1200000) {
    tax = 45000 + (income - 900000) * 0.15;
  } else if (income <= 1500000) {
    tax = 90000 + (income - 1200000) * 0.2;
  } else {
    tax = 150000 + (income - 1500000) * 0.3;
  }
  
  return Math.round(tax);
}

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`
======================================
Alternative Server successfully started!
Listening at http://localhost:${PORT}

Available endpoints:
- http://localhost:${PORT}/ (Frontend)
- http://localhost:${PORT}/health (API)
- http://localhost:${PORT}/api/chat (AI Chat API - POST)
- http://localhost:${PORT}/api/demo/calculate (Tax Calculator API - POST)
======================================
`);
}); 