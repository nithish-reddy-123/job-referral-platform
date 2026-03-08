const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  uploadAvatar,
  uploadResume,
  searchUsers,
  toggleBookmark,
  getAllUsers,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { uploadImage, uploadResume: uploadResumeMiddleware } = require('../middleware/upload');
const { mongoIdValidation } = require('../middleware/validators');

router.get('/search', protect, searchUsers);
router.get('/admin/all', protect, authorize('admin'), getAllUsers);
router.get('/:id', mongoIdValidation, getUserProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, uploadImage.single('avatar'), uploadAvatar);
router.post('/resume', protect, uploadResumeMiddleware.single('resume'), uploadResume);
router.post('/bookmark/:jobId', protect, toggleBookmark);

module.exports = router;
