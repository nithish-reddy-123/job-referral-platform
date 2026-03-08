const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    // Request details
    message: {
      type: String,
      maxlength: 2000,
      required: [true, 'Please include a message with your referral request'],
    },
    resume: {
      url: String,
      publicId: String,
      fileName: String,
    },
    coverLetter: {
      type: String,
      maxlength: 5000,
    },
    // Status tracking
    status: {
      type: String,
      enum: [
        'pending',      // Initial request
        'viewed',       // Referrer has seen it
        'accepted',     // Referrer agreed to refer
        'submitted',    // Referral submitted to company
        'interviewing', // Candidate is interviewing
        'hired',        // Candidate got hired
        'rejected',     // Referrer declined
        'withdrawn',    // Job seeker withdrew
        'expired',      // Request expired
      ],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        note: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    // Referrer notes (private)
    referrerNotes: {
      type: String,
      maxlength: 1000,
    },
    // Feedback
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      givenBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      givenAt: Date,
    },
    // Priority
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent duplicate referral requests
referralSchema.index({ job: 1, jobSeeker: 1, referrer: 1 }, { unique: true });
referralSchema.index({ jobSeeker: 1, status: 1 });
referralSchema.index({ referrer: 1, status: 1 });
referralSchema.index({ company: 1 });
referralSchema.index({ createdAt: -1 });

// Add status change to history
referralSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});

module.exports = mongoose.model('Referral', referralSchema);
