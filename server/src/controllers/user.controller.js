/**
 * User Controller
 * Handles user profile management and settings
 */

const User = require('../models/user.model');
const Chat = require('../models/chat.model');
const { ApiError } = require('../middleware/error.middleware');

/**
 * Get user profile
 * @route GET /api/user/profile
 * @access Private
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

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
 * Update user profile
 * @route PUT /api/user/profile
 * @access Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    
    // Basic validation
    if (!name && !email) {
      return next(new ApiError('Please provide at least one field to update', 400));
    }

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    // Check for duplicate email error
    if (error.code === 11000) {
      return next(new ApiError('Email already in use', 400));
    }
    next(error);
  }
};

/**
 * Update user preferences
 * @route PATCH /api/user/preferences
 * @access Private
 */
exports.updatePreferences = async (req, res, next) => {
  try {
    const { taxRegime, notifications, theme } = req.body;
    
    // Build preferences object
    const preferences = {};
    
    if (taxRegime !== undefined) preferences['preferences.taxRegime'] = taxRegime;
    if (notifications !== undefined) preferences['preferences.notifications'] = notifications; 
    if (theme !== undefined) preferences['preferences.theme'] = theme;

    // If no preferences were provided
    if (Object.keys(preferences).length === 0) {
      return next(new ApiError('Please provide at least one preference to update', 400));
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: preferences },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(new ApiError('User not found', 404));
    }

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
 * Update tax profile
 * @route PATCH /api/user/tax-profile
 * @access Private
 */
exports.updateTaxProfile = async (req, res, next) => {
  try {
    const { 
      salary, 
      investments, 
      deductions,
      rentIncome,
      businessIncome,
      capitalGains,
      otherIncome
    } = req.body;
    
    // Build tax profile object
    const taxProfile = {};
    
    if (salary !== undefined) taxProfile['taxProfile.salary'] = salary;
    if (investments !== undefined) taxProfile['taxProfile.investments'] = investments;
    if (deductions !== undefined) taxProfile['taxProfile.deductions'] = deductions;
    if (rentIncome !== undefined) taxProfile['taxProfile.rentIncome'] = rentIncome;
    if (businessIncome !== undefined) taxProfile['taxProfile.businessIncome'] = businessIncome;
    if (capitalGains !== undefined) taxProfile['taxProfile.capitalGains'] = capitalGains;
    if (otherIncome !== undefined) taxProfile['taxProfile.otherIncome'] = otherIncome;

    // If no tax profile fields were provided
    if (Object.keys(taxProfile).length === 0) {
      return next(new ApiError('Please provide at least one tax profile field to update', 400));
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: taxProfile },
      { new: true }
    ).select('-password');

    if (!user) {
      return next(new ApiError('User not found', 404));
    }

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
 * Get user chat history
 * @route GET /api/user/chats
 * @access Private
 */
exports.getChatHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || '-lastUpdated';
    const isStarred = req.query.starred === 'true';
    const searchTerm = req.query.search || '';

    // Build filter
    const filter = { user: req.user.id };
    
    // Add starred filter if specified
    if (req.query.starred !== undefined) {
      filter.isStarred = isStarred;
    }

    // Add search term if specified
    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { 'messages.content': { $regex: searchTerm, $options: 'i' } }
      ];
    }

    // Execute query
    const chats = await Chat.find(filter)
      .select('title lastUpdated isActive isStarred tags taxContext')
      .sort(sortBy)
      .skip(skip)
      .limit(limit);

    // Count total documents
    const total = await Chat.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        chats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user account and all associated data
 * @route DELETE /api/user
 * @access Private
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return next(new ApiError('User not found', 404));
    }

    // Delete all user's chats
    await Chat.deleteMany({ user: req.user.id });
    
    // Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Account and all associated data deleted successfully'
    });
  } catch (error) {
    next(error);
  }
}; 