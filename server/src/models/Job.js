const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: 200,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: 10000,
    },
    requirements: [String],
    responsibilities: [String],
    skills: [{ type: String, trim: true }],
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'],
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
      required: true,
    },
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'USD' },
      isNegotiable: { type: Boolean, default: false },
    },
    location: {
      city: String,
      state: String,
      country: String,
      remote: { type: Boolean, default: false },
    },
    department: String,
    applicationDeadline: Date,
    applicationUrl: String, // External application link
    // Referral-specific
    referralId: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    referralBonus: {
      amount: Number,
      currency: { type: String, default: 'USD' },
    },
    isReferralOnly: { type: Boolean, default: false },
    maxReferrals: { type: Number, default: 10 },
    currentReferrals: { type: Number, default: 0 },
    // Status
    status: {
      type: String,
      enum: ['active', 'closed', 'draft', 'paused'],
      default: 'active',
    },
    views: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 },
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

jobSchema.index({ title: 'text', description: 'text', skills: 'text', tags: 'text' });
jobSchema.index({ company: 1, status: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ type: 1, experienceLevel: 1 });
jobSchema.index({ 'location.country': 1, 'location.city': 1 });
jobSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);
