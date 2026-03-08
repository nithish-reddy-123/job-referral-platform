const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: `"Job Referral Platform" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

// Email templates
const sendReferralRequestEmail = async (referrer, jobSeeker, job) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Referral Request</h2>
      <p>Hi ${referrer.firstName},</p>
      <p><strong>${jobSeeker.firstName} ${jobSeeker.lastName}</strong> has requested a referral from you for the position:</p>
      <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin: 0; color: #1f2937;">${job.title}</h3>
      </div>
      <p>Please log in to your account to review and respond to this request.</p>
      <a href="${process.env.CLIENT_URL}/referrals" 
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
        View Request
      </a>
      <p style="color: #6b7280; margin-top: 24px; font-size: 14px;">
        - Job Referral Platform Team
      </p>
    </div>
  `;

  return sendEmail({
    to: referrer.email,
    subject: `New Referral Request from ${jobSeeker.firstName} ${jobSeeker.lastName}`,
    html,
  });
};

const sendReferralStatusEmail = async (jobSeeker, status, jobTitle) => {
  const statusMessages = {
    accepted: 'Your referral request has been accepted! The referrer will forward your profile.',
    rejected: 'Unfortunately, your referral request was not accepted this time.',
    submitted: 'Great news! Your referral has been submitted to the company.',
    interviewing: 'Congratulations! You have been moved to the interview stage.',
    hired: 'Amazing! Congratulations on being hired! 🎉',
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Referral Status Update</h2>
      <p>Hi ${jobSeeker.firstName},</p>
      <p>${statusMessages[status] || `Your referral status has been updated to: ${status}`}</p>
      <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <p style="margin: 0;"><strong>Position:</strong> ${jobTitle}</p>
        <p style="margin: 4px 0 0;"><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</p>
      </div>
      <a href="${process.env.CLIENT_URL}/referrals" 
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 16px;">
        View Details
      </a>
    </div>
  `;

  return sendEmail({
    to: jobSeeker.email,
    subject: `Referral Update: ${jobTitle} - ${status}`,
    html,
  });
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>Hi ${user.firstName},</p>
      <p>You requested to reset your password. Click the button below to set a new password:</p>
      <a href="${resetUrl}" 
         style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 16px 0;">
        Reset Password
      </a>
      <p style="color: #6b7280; font-size: 14px;">This link will expire in 1 hour.</p>
      <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px;">- Job Referral Platform Team</p>
    </div>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Password Reset Request',
    html,
  });
};

module.exports = { sendEmail, sendReferralRequestEmail, sendReferralStatusEmail, sendPasswordResetEmail };
