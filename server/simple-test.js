/**
 * Test server for debugging
 */
const express = require('express');
const app = express();
const PORT = 8080;

// Basic middleware
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Test server is running correctly!',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Health check passed',
    timestamp: new Date().toISOString()
  });
});

// Demo API endpoint
app.get('/api/demo', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working correctly',
    features: ['Tax Calculator', 'AI Chat', 'User Profile']
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
=============================================================
  Test server is running at http://localhost:${PORT}
  
  Available endpoints:
  - http://localhost:${PORT}/
  - http://localhost:${PORT}/health
  - http://localhost:${PORT}/api/demo
=============================================================
  `);
}); 