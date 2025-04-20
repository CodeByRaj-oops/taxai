/**
 * Authentication Controller
 * Handles user registration, login, and session management
 */

const User = require('../models/user.model');
const { ApiError } = require('../middleware/error.middleware');
const crypto = require('crypto');

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if all fields are provided
    if (!name || !email || !password) {
      return next(new ApiError('Please provide name, email and password', 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError('Email already in use', 400));
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate JWT token
    const token = user.generateAuthToken();

    // Remove sensitive data before sending response
    user.password = undefined;

    // Set token as cookie if in production
    if (process.env.NODE_ENV === 'production') {
      res.cookie('token', token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'strict'
      });
    }

    // Send response
    res.status(201).json({
      success: true,
      token,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log in a user
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return next(new ApiError('Please provide email and password', 400));
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError('Invalid email or password', 401));
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    // Update last login timestamp
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Remove password from output
    user.password = undefined;

    // Set token as cookie if in production
    if (process.env.NODE_ENV === 'production') {
      res.cookie('token', token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'strict'
      });
    }

    // Send response
    res.status(200).json({
      success: true,
      token,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Log out a user
 * @route GET /api/auth/logout
 * @access Private
 */
exports.logout = (req, res) => {
  // Clear cookie if in production
  if (process.env.NODE_ENV === 'production') {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000), // 10 seconds
      httpOnly: true
    });
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

/**
 * Get current user
 * @route GET /api/auth/me
 * @access Private
 */
exports.getMe = async (req, res, next) => {
  try {
    // User is already available from auth middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user password
 * @route PUT /api/auth/update-password
 * @access Private
 */
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check if passwords are provided
    if (!currentPassword || !newPassword) {
      return next(new ApiError('Please provide current and new password', 400));
    }

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check if current password is correct
    if (!(await user.comparePassword(currentPassword))) {
      return next(new ApiError('Current password is incorrect', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token
    const token = user.generateAuthToken();

    // Remove password from output
    user.password = undefined;

    // Set token as cookie if in production
    if (process.env.NODE_ENV === 'production') {
      res.cookie('token', token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'strict'
      });
    }

    // Send response
    res.status(200).json({
      success: true,
      token,
      message: 'Password updated successfully',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate password reset token
 * @route POST /api/auth/forgot-password
 * @access Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return next(new ApiError('Please provide an email', 400));
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError('No user found with that email', 404));
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetURL = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;

    try {
      // In a real implementation, you would send an email with the reset link
      // For this example, we'll just return the token

      res.status(200).json({
        success: true,
        message: 'Token sent to email',
        resetURL // Only for development, remove in production
      });
    } catch (error) {
      // If sending email fails, reset the token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ApiError('There was an error sending the email. Try again later.', 500));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Reset password
 * @route PUT /api/auth/reset-password/:token
 * @access Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Check if password is provided
    if (!password) {
      return next(new ApiError('Please provide a password', 400));
    }

    // Hash the token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user by token and check if token is expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ApiError('Invalid or expired token', 400));
    }

    // Update password and clear reset token fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate new token
    const jwtToken = user.generateAuthToken();

    // Remove password from output
    user.password = undefined;

    // Set token as cookie if in production
    if (process.env.NODE_ENV === 'production') {
      res.cookie('token', jwtToken, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'strict'
      });
    }

    // Send response
    res.status(200).json({
      success: true,
      token: jwtToken,
      message: 'Password reset successful',
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
}; 