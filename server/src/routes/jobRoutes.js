const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require('../controllers/jobController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { createJobValidation, mongoIdValidation } = require('../middleware/validators');

router.get('/', optionalAuth, getJobs);
router.get('/my-jobs', protect, authorize('referrer', 'admin'), getMyJobs);
router.get('/:id', mongoIdValidation, optionalAuth, getJob);
router.post('/', protect, authorize('referrer', 'admin'), createJobValidation, createJob);
router.put('/:id', protect, mongoIdValidation, updateJob);
router.delete('/:id', protect, mongoIdValidation, deleteJob);

module.exports = router;
