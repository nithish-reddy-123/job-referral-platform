const Job = require('../models/Job');
const Company = require('../models/Company');
const { AppError } = require('../middleware/errorHandler');

// @desc    Create a new job posting
// @route   POST /api/jobs
const createJob = async (req, res, next) => {
  try {
    // Only referrers and admins can post jobs
    if (req.user.role === 'jobseeker') {
      throw new AppError('Job seekers cannot post jobs', 403);
    }

    const jobData = {
      ...req.body,
      postedBy: req.user._id,
    };

    const job = await Job.create(jobData);
    await job.populate([
      { path: 'company', select: 'name logo slug' },
      { path: 'postedBy', select: 'firstName lastName avatar' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs with filters
// @route   GET /api/jobs
const getJobs = async (req, res, next) => {
  try {
    const {
      q, company, type, experienceLevel, location, remote,
      minSalary, maxSalary, skills, status = 'active',
      sort = '-createdAt', page = 1, limit = 20,
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (q) filter.$text = { $search: q };
    if (company) filter.company = company;
    if (type) filter.type = type;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (location) {
      filter['location.city'] = new RegExp(location, 'i');
    }
    if (remote === 'true') filter['location.remote'] = true;
    if (minSalary || maxSalary) {
      filter['salary.min'] = {};
      if (minSalary) filter['salary.min'].$gte = parseInt(minSalary);
      if (maxSalary) filter['salary.max'] = { $lte: parseInt(maxSalary) };
    }
    if (skills) {
      filter.skills = { $in: skills.split(',').map((s) => s.trim()) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOption = sort.startsWith('-')
      ? { [sort.slice(1)]: -1 }
      : { [sort]: 1 };

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('company', 'name logo slug industry')
        .populate('postedBy', 'firstName lastName avatar')
        .skip(skip)
        .limit(parseInt(limit))
        .sort(sortOption),
      Job.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        jobs,
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

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
const getJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('company', 'name logo slug industry size headquarters description')
      .populate('postedBy', 'firstName lastName avatar headline currentPosition');

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    res.json({ success: true, data: { job } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      throw new AppError('Job not found', 404);
    }

    // Only the poster or admin can update
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new AppError('Not authorized to update this job', 403);
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('company', 'name logo slug')
      .populate('postedBy', 'firstName lastName avatar');

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: { job },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      throw new AppError('Job not found', 404);
    }

    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new AppError('Not authorized to delete this job', 403);
    }

    await job.deleteOne();

    res.json({
      success: true,
      message: 'Job deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by current user
// @route   GET /api/jobs/my-jobs
const getMyJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = { postedBy: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('company', 'name logo slug')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      Job.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        jobs,
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
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getMyJobs,
};
