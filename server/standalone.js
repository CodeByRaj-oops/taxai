/**
 * Standalone Express Server - No Database Dependencies
 * This version works without MongoDB or Redis
 */
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Indian Tax Consultation API is running',
    version: '1.0.0'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Demo features endpoint
app.get('/api/demo/features', (req, res) => {
  res.json({
    success: true,
    data: {
      features: [
        {
          id: 1,
          name: 'Tax Calculation',
          description: 'Compare old vs new tax regime to find the best option for you',
          available: true
        },
        {
          id: 2,
          name: 'AI Tax Assistant',
          description: 'Get personalized tax advice from our AI assistant',
          available: true
        },
        {
          id: 3,
          name: 'Document Storage',
          description: 'Securely store and manage your tax documents',
          available: false
        },
        {
          id: 4,
          name: 'Tax Filing',
          description: 'File your taxes directly through our platform',
          available: false
        }
      ]
    }
  });
});

// Demo tax calculation endpoint
app.post('/api/demo/calculate', (req, res) => {
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

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
=============================================================
  ✨ Standalone server running at http://localhost:${PORT}
  
  Available endpoints:
  - http://localhost:${PORT}/
  - http://localhost:${PORT}/api/health
  - http://localhost:${PORT}/api/demo/features
  - http://localhost:${PORT}/api/demo/calculate (POST)
=============================================================
  `);
}); 