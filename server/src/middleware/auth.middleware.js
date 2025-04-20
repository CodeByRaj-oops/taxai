/**
 * Authentication Middleware
 * Verifies JWT tokens and manages user authentication
 */

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/user.model');

/**
 * Middleware to authenticate users using JWT
 */
exports.authenticate = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from Bearer header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Alternative: extract token from cookies
      token = req.cookies.token;
    }

    // If no token is found, return unauthorized
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please log in to access this resource'
      });
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET || 'somesecretkey'
    );

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists'
      });
    }

    // Add user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    // If token is invalid or expired
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token'
    });
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param {...String} roles - Allowed roles
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if user role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

/**
 * Middleware to check if the user is authenticated, but don't block if not
 * Useful for routes that can work with or without authentication
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract token from Bearer header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      // Alternative: extract token from cookies
      token = req.cookies.token;
    }

    // If no token, continue without authentication
    if (!token) {
      return next();
    }

    // Verify token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET || 'somesecretkey'
    );

    // Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    // Add user to request object
    req.user = currentUser;
    next();
  } catch (error) {
    // If token is invalid, continue without authentication
    next();
  }
}; 