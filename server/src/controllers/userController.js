const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');
const cloudinary = require('../config/cloudinary');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-refreshTokens -loginAttempts -lockUntil')
      .populate('currentCompany', 'name logo slug industry');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'firstName', 'lastName', 'headline', 'bio', 'phone',
      'location', 'skills', 'experience', 'education',
      'currentCompany', 'currentPosition', 'socialLinks',
      'notificationPreferences',
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select('-refreshTokens -loginAttempts -lockUntil');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload avatar
// @route   POST /api/users/avatar
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Please upload an image', 400);
    }

    // Delete old avatar if exists
    if (req.user.avatar?.publicId) {
      await cloudinary.uploader.destroy(req.user.avatar.publicId);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: {
          url: req.file.path,
          publicId: req.file.filename,
        },
      },
      { new: true }
    ).select('-refreshTokens');

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { avatar: user.avatar },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/users/resume
const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('Please upload a resume', 400);
    }

    // Delete old resume if exists
    if (req.user.resume?.publicId) {
      await cloudinary.uploader.destroy(req.user.resume.publicId, {
        resource_type: 'raw',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        resume: {
          url: req.file.path,
          publicId: req.file.filename,
          fileName: req.file.originalname,
          uploadedAt: new Date(),
        },
      },
      { new: true }
    ).select('-refreshTokens');

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: { resume: user.resume },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users (referrers)
// @route   GET /api/users/search
const searchUsers = async (req, res, next) => {
  try {
    const { q, role, company, skills, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (q) {
      filter.$text = { $search: q };
    }
    if (role) {
      filter.role = role;
    }
    if (company) {
      filter.currentCompany = company;
    }
    if (skills) {
      filter.skills = { $in: skills.split(',').map((s) => s.trim()) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('firstName lastName avatar headline currentCompany currentPosition skills')
        .populate('currentCompany', 'name logo')
        .skip(skip)
        .limit(parseInt(limit))
        .sort(q ? { score: { $meta: 'textScore' } } : { createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bookmark / Unbookmark a job
// @route   POST /api/users/bookmark/:jobId
const toggleBookmark = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const user = await User.findById(req.user._id);

    const index = user.bookmarkedJobs.indexOf(jobId);
    if (index > -1) {
      user.bookmarkedJobs.splice(index, 1);
    } else {
      user.bookmarkedJobs.push(jobId);
    }
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: index > -1 ? 'Bookmark removed' : 'Job bookmarked',
      data: { bookmarkedJobs: user.bookmarkedJobs },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users/admin/all
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (search) filter.$text = { $search: search };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-refreshTokens -loginAttempts -lockUntil')
        .populate('currentCompany', 'name')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateProfile,
  uploadAvatar,
  uploadResume,
  searchUsers,
  toggleBookmark,
  getAllUsers,
};
