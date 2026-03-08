const express = require('express');
const router = express.Router();
const {
  createCompany,
  getCompanies,
  getCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const { mongoIdValidation } = require('../middleware/validators');

router.get('/', getCompanies);
router.get('/:slug', getCompany);
router.post('/', protect, authorize('referrer', 'admin'), createCompany);
router.put('/:id', protect, mongoIdValidation, updateCompany);
router.delete('/:id', protect, authorize('admin'), mongoIdValidation, deleteCompany);

module.exports = router;
