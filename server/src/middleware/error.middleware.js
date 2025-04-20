/**
 * Error Handling Middleware
 * Manages error responses and logging
 */

/**
 * Custom API Error class
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle MongoDB duplicate key errors
 * @param {Error} err - The error object
 * @returns {ApiError} - Formatted error
 */
const handleDuplicateKeyError = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value.`;
  return new ApiError(message, 400);
};

/**
 * Handle Mongoose validation errors
 * @param {Error} err - The error object
 * @returns {ApiError} - Formatted error
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new ApiError(message, 400);
};

/**
 * Handle JWT errors
 * @param {Error} err - The error object
 * @returns {ApiError} - Formatted error
 */
const handleJWTError = () => {
  return new ApiError('Invalid token. Please log in again.', 401);
};

/**
 * Handle JWT expiration
 * @returns {ApiError} - Formatted error
 */
const handleJWTExpiredError = () => {
  return new ApiError('Your token has expired. Please log in again.', 401);
};

/**
 * Handle development environment errors
 * @param {Error} err - The error object
 * @param {Object} res - Express response object
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

/**
 * Handle production environment errors
 * @param {Error} err - The error object
 * @param {Object} res - Express response object
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

/**
 * Main error handling middleware
 */
exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.code === 11000) error = handleDuplicateKeyError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

// Export ApiError for use in controllers
exports.ApiError = ApiError; 