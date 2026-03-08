const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Don't include password in queries by default
    },
    role: {
      type: String,
      enum: ['jobseeker', 'referrer', 'admin'],
      default: 'jobseeker',
    },
    avatar: {
      url: String,
      publicId: String,
    },
    headline: {
      type: String,
      maxlength: 200,
    },
    bio: {
      type: String,
      maxlength: 2000,
    },
    phone: String,
    location: {
      city: String,
      state: String,
      country: String,
    },
    // Professional Details
    skills: [{ type: String, trim: true }],
    experience: [
      {
        title: String,
        company: String,
        location: String,
        startDate: Date,
        endDate: Date,
        current: { type: Boolean, default: false },
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        startDate: Date,
        endDate: Date,
        grade: String,
      },
    ],
    // Referrer-specific fields
    currentCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    currentPosition: String,
    employeeId: String, // For verification
    isVerifiedEmployee: { type: Boolean, default: false },
    referralCapacity: { type: Number, default: 5 }, // Max referrals per month
    referralsGivenThisMonth: { type: Number, default: 0 },
    // Resume
    resume: {
      url: String,
      publicId: String,
      fileName: String,
      uploadedAt: Date,
    },
    // Social links
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
      twitter: String,
    },
    // Bookmarks
    bookmarkedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    // Account status
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshTokens: [{ token: String, expiresAt: Date }],
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,
    // Notification preferences
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      referralUpdates: { type: Boolean, default: true },
      messageAlerts: { type: Boolean, default: true },
      jobAlerts: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Index for search
userSchema.index({ firstName: 'text', lastName: 'text', skills: 'text', headline: 'text' });
userSchema.index({ role: 1 });
userSchema.index({ currentCompany: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.methods.isLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

module.exports = mongoose.model('User', userSchema);
