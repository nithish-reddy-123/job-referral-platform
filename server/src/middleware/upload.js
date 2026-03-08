const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary storage for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'job-referral/resumes',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx'],
    transformation: [],
  },
});

// Cloudinary storage for images (avatars, logos)
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'job-referral/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit', quality: 'auto' }],
  },
});

// File filter
const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]),
});

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: fileFilter(['image/jpeg', 'image/png', 'image/webp']),
});

module.exports = { uploadResume, uploadImage };
