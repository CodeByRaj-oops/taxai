/**
 * Server Initialization
 * Connects to databases and starts the Express server
 */

const dotenv = require('dotenv');
const { connectToDatabase, setupRedisConnection, closeDatabase } = require('./config/database');

// Load environment variables
dotenv.config({ path: '.env' });

// Import application
const app = require('./app');

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Start server first, then attempt database connection
const startServer = async () => {
  try {
    // Initialize and start the HTTP server
    const port = process.env.PORT || 5000;
    const host = '0.0.0.0'; // Listen on all network interfaces
    
    const server = app.listen(port, host, () => {
      console.log(`
=============================================================
  ✅ Server is running on http://localhost:${port}
  🌎 Environment: ${process.env.NODE_ENV || 'development'}
=============================================================`);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', err => {
      console.error('UNHANDLED REJECTION! 💥');
      console.error(err.name, err.message);
      console.error(err.stack);
      // Don't crash the server for promise rejections
    });

    // Handle SIGTERM signal
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(async () => {
        await closeDatabase();
        console.log('💥 Process terminated!');
      });
    });
    
    // Try to connect to MongoDB (but continue if it fails)
    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('❌ MongoDB connection error:', dbError.message);
      console.log('📝 Server will continue running with limited functionality');
    }

    // Try to connect to Redis if URL is provided
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        await setupRedisConnection(redisUrl);
      } catch (redisError) {
        console.error('❌ Redis connection error:', redisError.message);
        console.log('📝 Server will continue running without Redis');
      }
    }
    
    return server;
  } catch (error) {
    console.error('❌ Error during server startup:', error);
    console.error('💥 Exiting process');
    process.exit(1);
  }
};

// Start the server
startServer().catch(err => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
}); 