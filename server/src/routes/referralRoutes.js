const express = require('express');
const router = express.Router();
const {
  createReferral,
  getMyReferrals,
  getReferral,
  updateReferralStatus,
  addFeedback,
} = require('../controllers/referralController');
const { protect } = require('../middleware/auth');
const { createReferralValidation, mongoIdValidation } = require('../middleware/validators');

router.post('/', protect, createReferralValidation, createReferral);
router.get('/', protect, getMyReferrals);
router.get('/:id', protect, mongoIdValidation, getReferral);
router.patch('/:id/status', protect, mongoIdValidation, updateReferralStatus);
router.post('/:id/feedback', protect, mongoIdValidation, addFeedback);

module.exports = router;
