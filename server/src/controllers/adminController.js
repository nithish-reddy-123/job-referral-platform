const User = require('../models/User');
const Job = require('../models/Job');
const Referral = require('../models/Referral');
const Company = require('../models/Company');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalJobs,
      totalReferrals,
      totalCompanies,
      activeJobs,
      pendingReferrals,
      usersByRole,
      referralsByStatus,
      recentUsers,
      recentReferrals,
    ] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Referral.countDocuments(),
      Company.countDocuments(),
      Job.countDocuments({ status: 'active' }),
      Referral.countDocuments({ status: 'pending' }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } },
      ]),
      Referral.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      User.find()
        .select('firstName lastName email role createdAt')
        .sort({ createdAt: -1 })
        .limit(10),
      Referral.find()
        .populate('jobSeeker', 'firstName lastName')
        .populate('referrer', 'firstName lastName')
        .populate('job', 'title')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    // Monthly registration trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const registrationTrend = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalJobs,
          totalReferrals,
          totalCompanies,
          activeJobs,
          pendingReferrals,
        },
        usersByRole,
        referralsByStatus,
        registrationTrend,
        recentUsers,
        recentReferrals,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (activate/deactivate)
// @route   PATCH /api/admin/users/:id/status
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('firstName lastName email role isActive');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify company
// @route   PATCH /api/admin/companies/:id/verify
const verifyCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    res.json({
      success: true,
      message: 'Company verified successfully',
      data: { company },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, updateUserStatus, verifyCompany };
