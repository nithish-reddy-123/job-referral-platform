const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'referral_request',
        'referral_accepted',
        'referral_rejected',
        'referral_status_update',
        'new_message',
        'job_posted',
        'job_match',
        'profile_view',
        'system',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // Link to related resource
    resourceType: {
      type: String,
      enum: ['referral', 'job', 'message', 'user', 'company'],
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // TTL: 30 days

module.exports = mongoose.model('Notification', notificationSchema);
