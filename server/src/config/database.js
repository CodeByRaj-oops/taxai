/**
 * Database connection configuration
 * Uses MongoDB for user data and chat history storage
 */

const mongoose = require('mongoose');
const Redis = require('ioredis');

// Redis client for caching
let redisClient = null;

/**
 * Connect to MongoDB database
 */
const connectToDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/indiantax';
    
    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    await mongoose.connect(mongoUri, options);
    console.log('✅ MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('💡 Continuing without MongoDB - some features may not work properly');
    return false;
    // Don't exit the process, allow the app to run without MongoDB
  }
};

/**
 * Set up Redis connection for caching
 */
const setupRedisConnection = () => {
  try {
    redisClient = new Redis(process.env.REDIS_URI);
    
    redisClient.on('connect', () => {
      console.log('✅ Redis connected successfully');
    });
    
    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
      // Continue without Redis if connection fails
      redisClient = null;
    });
    
    return true;
  } catch (error) {
    console.error('Redis setup error:', error);
    // Continue without Redis
    redisClient = null;
    return false;
  }
};

/**
 * Get Redis client instance
 * @returns {Object|null} Redis client or null if not connected
 */
const getRedisClient = () => redisClient;

/**
 * Close database connections
 */
const closeDatabaseConnections = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
    
    if (redisClient) {
      await redisClient.quit();
      console.log('Redis connection closed');
    }
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
};

module.exports = {
  connectToDatabase,
  getRedisClient,
  setupRedisConnection,
  closeDatabase: closeDatabaseConnections
}; 