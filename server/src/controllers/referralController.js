const Referral = require('../models/Referral');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { AppError } = require('../middleware/errorHandler');

// @desc    Create a referral request
// @route   POST /api/referrals
const createReferral = async (req, res, next) => {
  try {
    const { job: jobId, referrer: referrerId, message, coverLetter } = req.body;

    // Only job seekers can request referrals
    if (req.user.role !== 'jobseeker') {
      throw new AppError('Only job seekers can request referrals', 403);
    }

    // Validate job exists and is active
    const job = await Job.findById(jobId);
    if (!job || job.status !== 'active') {
      throw new AppError('Job not found or no longer active', 404);
    }

    // Validate referrer exists and is a referrer
    const referrer = await User.findById(referrerId);
    if (!referrer || referrer.role !== 'referrer') {
      throw new AppError('Referrer not found', 404);
    }

    // Check referrer capacity
    if (referrer.referralsGivenThisMonth >= referrer.referralCapacity) {
      throw new AppError('Referrer has reached their monthly referral limit', 400);
    }

    // Check for duplicate request
    const existing = await Referral.findOne({
      job: jobId,
      jobSeeker: req.user._id,
      referrer: referrerId,
    });
    if (existing) {
      throw new AppError('You have already requested a referral for this job from this referrer', 400);
    }

    // Build referral data
    const referralData = {
      job: jobId,
      jobSeeker: req.user._id,
      referrer: referrerId,
      company: job.company,
      message,
      coverLetter,
    };

    // Attach resume from user profile if available
    if (req.user.resume?.url) {
      referralData.resume = req.user.resume;
    }

    const referral = await Referral.create(referralData);
    await referral.populate([
      { path: 'job', select: 'title company' },
      { path: 'jobSeeker', select: 'firstName lastName avatar' },
      { path: 'referrer', select: 'firstName lastName avatar' },
    ]);

    // Create notification for referrer
    await Notification.create({
      recipient: referrerId,
      sender: req.user._id,
      type: 'referral_request',
      title: 'New Referral Request',
      message: `${req.user.fullName} has requested a referral for ${job.title}`,
      resourceType: 'referral',
      resourceId: referral._id,
    });

    // Emit real-time notification via socket
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${referrerId}`).emit('notification', {
        type: 'referral_request',
        referral,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Referral request sent successfully',
      data: { referral },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get referrals for the current user
// @route   GET /api/referrals
const getMyReferrals = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, type } = req.query;
    const filter = {};

    // 'type' distinguishes requests made vs requests received
    if (type === 'received') {
      filter.referrer = req.user._id;
    } else {
      filter.jobSeeker = req.user._id;
    }
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [referrals, total] = await Promise.all([
      Referral.find(filter)
        .populate('job', 'title company type experienceLevel')
        .populate('jobSeeker', 'firstName lastName avatar headline')
        .populate('referrer', 'firstName lastName avatar currentPosition')
        .populate('company', 'name logo')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Referral.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        referrals,
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

// @desc    Get single referral
// @route   GET /api/referrals/:id
const getReferral = async (req, res, next) => {
  try {
    const referral = await Referral.findById(req.params.id)
      .populate('job', 'title company type description')
      .populate('jobSeeker', 'firstName lastName avatar headline skills resume')
      .populate('referrer', 'firstName lastName avatar currentPosition currentCompany')
      .populate('company', 'name logo');

    if (!referral) {
      throw new AppError('Referral not found', 404);
    }

    // Only involved parties or admin can view
    const isInvolved =
      referral.jobSeeker._id.toString() === req.user._id.toString() ||
      referral.referrer._id.toString() === req.user._id.toString() ||
      req.user.role === 'admin';

    if (!isInvolved) {
      throw new AppError('Not authorized to view this referral', 403);
    }

    // Mark as viewed if referrer is viewing for the first time
    if (
      referral.referrer._id.toString() === req.user._id.toString() &&
      referral.status === 'pending'
    ) {
      referral.status = 'viewed';
      await referral.save();
    }

    res.json({ success: true, data: { referral } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update referral status (accept/reject/etc.)
// @route   PATCH /api/referrals/:id/status
const updateReferralStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;
    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      throw new AppError('Referral not found', 404);
    }

    // Validate state transitions
    const validTransitions = {
      pending: ['viewed', 'accepted', 'rejected', 'withdrawn'],
      viewed: ['accepted', 'rejected', 'withdrawn'],
      accepted: ['submitted', 'withdrawn'],
      submitted: ['interviewing', 'rejected'],
      interviewing: ['hired', 'rejected'],
    };

    const allowed = validTransitions[referral.status] || [];
    if (!allowed.includes(status)) {
      throw new AppError(
        `Cannot transition from '${referral.status}' to '${status}'`,
        400
      );
    }

    // Authorization checks
    const isReferrer = referral.referrer.toString() === req.user._id.toString();
    const isJobSeeker = referral.jobSeeker.toString() === req.user._id.toString();

    if (status === 'withdrawn' && !isJobSeeker) {
      throw new AppError('Only the job seeker can withdraw', 403);
    }
    if (['accepted', 'rejected', 'submitted'].includes(status) && !isReferrer && req.user.role !== 'admin') {
      throw new AppError('Only the referrer can accept/reject/submit referrals', 403);
    }

    referral.status = status;
    referral.statusHistory.push({
      status,
      changedBy: req.user._id,
      note,
      timestamp: new Date(),
    });

    if (status === 'accepted') {
      // Increment referrer's monthly count
      await User.findByIdAndUpdate(referral.referrer, {
        $inc: { referralsGivenThisMonth: 1 },
      });
      // Increment job's referral count
      await Job.findByIdAndUpdate(referral.job, {
        $inc: { currentReferrals: 1 },
      });
    }

    await referral.save();

    // Notify the other party
    const recipientId = isReferrer ? referral.jobSeeker : referral.referrer;
    await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type: 'referral_status_update',
      title: 'Referral Status Updated',
      message: `Your referral status has been updated to: ${status}`,
      resourceType: 'referral',
      resourceId: referral._id,
    });

    const io = req.app.get('io');
    if (io) {
      io.to(`user:${recipientId}`).emit('notification', {
        type: 'referral_status_update',
        referral,
      });
    }

    res.json({
      success: true,
      message: `Referral ${status} successfully`,
      data: { referral },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add feedback to referral
// @route   POST /api/referrals/:id/feedback
const addFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const referral = await Referral.findById(req.params.id);

    if (!referral) {
      throw new AppError('Referral not found', 404);
    }

    // Only involved parties can give feedback
    const isInvolved =
      referral.jobSeeker.toString() === req.user._id.toString() ||
      referral.referrer.toString() === req.user._id.toString();

    if (!isInvolved) {
      throw new AppError('Not authorized', 403);
    }

    referral.feedback = {
      rating,
      comment,
      givenBy: req.user._id,
      givenAt: new Date(),
    };
    await referral.save();

    res.json({
      success: true,
      message: 'Feedback added successfully',
      data: { referral },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReferral,
  getMyReferrals,
  getReferral,
  updateReferralStatus,
  addFeedback,
};
