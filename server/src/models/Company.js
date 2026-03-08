const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    logo: {
      url: String,
      publicId: String,
    },
    coverImage: {
      url: String,
      publicId: String,
    },
    description: {
      type: String,
      maxlength: 5000,
    },
    industry: {
      type: String,
      required: true,
    },
    website: String,
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5000+'],
    },
    founded: Number,
    headquarters: {
      city: String,
      state: String,
      country: String,
    },
    locations: [
      {
        city: String,
        state: String,
        country: String,
      },
    ],
    techStack: [String],
    benefits: [String],
    culture: {
      type: String,
      maxlength: 3000,
    },
    socialLinks: {
      linkedin: String,
      twitter: String,
      glassdoor: String,
    },
    // Verified employees count
    verifiedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for active jobs count
companySchema.virtual('activeJobs', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'company',
  count: true,
  match: { status: 'active' },
});

companySchema.index({ name: 'text', industry: 'text', techStack: 'text' });

// Auto-generate slug
companySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Company', companySchema);
