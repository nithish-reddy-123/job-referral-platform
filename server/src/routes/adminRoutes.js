const express = require('express');
const router = express.Router();
const { getDashboardStats, updateUserStatus, verifyCompany } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.patch('/users/:id/status', updateUserStatus);
router.patch('/companies/:id/verify', verifyCompany);

module.exports = router;
