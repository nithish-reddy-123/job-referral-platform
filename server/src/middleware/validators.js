const { body, query, param } = require('express-validator');
const { validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth validations
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required').isLength({ max: 50 }),
  body('lastName').trim().notEmpty().withMessage('Last name is required').isLength({ max: 50 }),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('role').optional().isIn(['jobseeker', 'referrer']).withMessage('Invalid role'),
  validate,
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Job validations
const createJobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required').isLength({ max: 200 }),
  body('company').isMongoId().withMessage('Valid company ID is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('type')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'remote'])
    .withMessage('Invalid job type'),
  body('experienceLevel')
    .isIn(['entry', 'mid', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),
  validate,
];

// Referral validations
const createReferralValidation = [
  body('job').isMongoId().withMessage('Valid job ID is required'),
  body('referrer').isMongoId().withMessage('Valid referrer ID is required'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Please include a message')
    .isLength({ max: 2000 }),
  validate,
];

// Pagination query validation
const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validate,
];

// MongoDB ID param validation
const mongoIdValidation = [
  param('id').isMongoId().withMessage('Invalid ID format'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  createJobValidation,
  createReferralValidation,
  paginationValidation,
  mongoIdValidation,
};
