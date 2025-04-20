/**
 * Main Application
 * Configures Express application with middleware and routes
 */

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/error.middleware');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/chat.routes');
const taxRoutes = require('./routes/tax.routes');

// Initialize express app
const app = express();

// Set security HTTP headers
app.use(helmet());

// Enable CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Apply stricter rate limits to AI routes
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many AI requests from this IP, please try again after 15 minutes'
});
app.use('/api/chat', aiLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Health check route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Demo/test route for frontend development
app.get('/api/demo/features', (req, res) => {
  res.status(200).json({
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

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tax', taxRoutes);

// 404 handler for undefined routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app; 