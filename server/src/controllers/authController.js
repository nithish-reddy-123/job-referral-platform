const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../middleware/auth');
const { AppError } = require('../middleware/errorHandler');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'jobseeker',
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Set cookies
    setTokenCookies(res, accessToken, refreshToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check if account is locked
    if (user.isLocked()) {
      throw new AppError('Account is temporarily locked. Try again later.', 423);
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 min
      }
      await user.save({ validateBeforeSave: false });
      throw new AppError('Invalid email or password', 401);
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Clean up expired refresh tokens and add new one
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.expiresAt > new Date()
    );
    user.refreshTokens.push({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save({ validateBeforeSave: false });

    setTokenCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    const cookieToken = req.cookies?.refreshToken;
    const currentToken = token || cookieToken;

    if (!currentToken) {
      throw new AppError('Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(currentToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if refresh token exists in user's token list
    const tokenExists = user.refreshTokens.some(
      (rt) => rt.token === currentToken && rt.expiresAt > new Date()
    );

    if (!tokenExists) {
      // Possible token reuse attack — invalidate all refresh tokens
      user.refreshTokens = [];
      await user.save({ validateBeforeSave: false });
      throw new AppError('Invalid refresh token. All sessions revoked.', 401);
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    // Replace old refresh token with new one (token rotation)
    user.refreshTokens = user.refreshTokens.filter(
      (rt) => rt.token !== currentToken
    );
    user.refreshTokens.push({
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    await user.save({ validateBeforeSave: false });

    setTokenCookies(res, newAccessToken, newRefreshToken);

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    const token = req.body.refreshToken || req.cookies?.refreshToken;

    if (token && req.user) {
      // Remove the refresh token
      req.user.refreshTokens = req.user.refreshTokens.filter(
        (rt) => rt.token !== token
      );
      await req.user.save({ validateBeforeSave: false });
    }

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('currentCompany', 'name logo slug')
      .populate('bookmarkedJobs', 'title company status');

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Helper: Set token cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth',
  });
};

// Helper: Remove sensitive fields from user object
const sanitizeUser = (user) => {
  const obj = user.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.loginAttempts;
  delete obj.lockUntil;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpires;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError('Please provide an email address', 400);
    }

    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    }

    // Generate reset token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    // Send reset email
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const { sendPasswordResetEmail } = require('../services/emailService');

    try {
      await sendPasswordResetEmail(user, resetUrl);
    } catch (emailError) {
      // If email fails, still return success but log the error
      console.error('Password reset email failed:', emailError.message);
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400);
    }

    const crypto = require('crypto');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Update password and clear reset fields
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    // Invalidate all refresh tokens for security
    user.refreshTokens = [];
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, refreshToken, logout, getMe, forgotPassword, resetPassword };
