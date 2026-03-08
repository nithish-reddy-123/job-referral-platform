const Company = require('../models/Company');
const Job = require('../models/Job');
const { AppError } = require('../middleware/errorHandler');

// @desc    Create a new company
// @route   POST /api/companies
const createCompany = async (req, res, next) => {
  try {
    const companyData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const company = await Company.create(companyData);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: { company },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all companies
// @route   GET /api/companies
const getCompanies = async (req, res, next) => {
  try {
    const { q, industry, size, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };

    if (q) filter.$text = { $search: q };
    if (industry) filter.industry = industry;
    if (size) filter.size = size;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [companies, total] = await Promise.all([
      Company.find(filter)
        .select('name slug logo industry size headquarters averageRating totalReviews')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ name: 1 }),
      Company.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        companies,
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

// @desc    Get single company by slug
// @route   GET /api/companies/:slug
const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug })
      .populate('verifiedEmployees', 'firstName lastName avatar currentPosition')
      .populate('createdBy', 'firstName lastName');

    if (!company) {
      throw new AppError('Company not found', 404);
    }

    // Get active jobs for this company
    const jobs = await Job.find({ company: company._id, status: 'active' })
      .select('title type experienceLevel location salary createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: { company, jobs },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company
// @route   PUT /api/companies/:id
const updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);
    if (!company) {
      throw new AppError('Company not found', 404);
    }

    if (
      company.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      throw new AppError('Not authorized to update this company', 403);
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: { company },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company (admin only)
// @route   DELETE /api/companies/:id
const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      throw new AppError('Company not found', 404);
    }

    await company.deleteOne();

    res.json({
      success: true,
      message: 'Company deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
};
