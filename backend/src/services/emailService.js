const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.EMAIL_PASS || process.env.SENDGRID_API_KEY
      }
    });
  }

  async sendEmail(options) {
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.text
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', options.email);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  async sendVerificationEmail(email, token) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verify Your Email - SerendibGo</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to SerendibGo!</h1>
              <p>Your adventure in Sri Lanka starts here</p>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for registering with SerendibGo! To complete your registration and start exploring amazing tours in Sri Lanka, please verify your email address.</p>
              <p>Click the button below to verify your email:</p>
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
              <p><strong>Note:</strong> This verification link will expire in 24 hours.</p>
            </div>
            <div class="footer">
              <p>If you didn't create an account with SerendibGo, please ignore this email.</p>
              <p>&copy; 2024 SerendibGo. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Welcome to SerendibGo!
      
      Thank you for registering with SerendibGo! To complete your registration and start exploring amazing tours in Sri Lanka, please verify your email address.
      
      Click this link to verify your email: ${verificationUrl}
      
      Note: This verification link will expire in 24 hours.
      
      If you didn't create an account with SerendibGo, please ignore this email.
      
      © 2024 SerendibGo. All rights reserved.
    `;

    await this.sendEmail({
      email,
      subject: 'Verify Your Email - SerendibGo',
      html,
      text
    });
  }

  async sendPasswordResetEmail(email, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Reset Your Password - SerendibGo</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
              <p>SerendibGo Account Security</p>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>We received a request to reset your password for your SerendibGo account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
              <div class="warning">
                <strong>Security Notice:</strong> This password reset link will expire in 10 minutes for your security.
              </div>
              <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>If you have any concerns about your account security, please contact our support team.</p>
              <p>&copy; 2024 SerendibGo. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
      Password Reset Request - SerendibGo
      
      We received a request to reset your password for your SerendibGo account.
      
      Click this link to reset your password: ${resetUrl}
      
      Security Notice: This password reset link will expire in 10 minutes for your security.
      
      If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
      
      If you have any concerns about your account security, please contact our support team.
      
      © 2024 SerendibGo. All rights reserved.
    `;

    await this.sendEmail({
      email,
      subject: 'Reset Your Password - SerendibGo',
      html,
      text
    });
  }

  async sendBookingConfirmationEmail(email, bookingDetails) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Booking Confirmation - SerendibGo</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
              <p>Your SerendibGo adventure awaits</p>
            </div>
            <div class="content">
              <h2>Booking Details</h2>
              <div class="booking-details">
                <p><strong>Tour:</strong> ${bookingDetails.tourTitle}</p>
                <p><strong>Date:</strong> ${bookingDetails.startDate}</p>
                <p><strong>Duration:</strong> ${bookingDetails.duration} days</p>
                <p><strong>Participants:</strong> ${bookingDetails.participants}</p>
                <p><strong>Total Amount:</strong> $${bookingDetails.totalAmount}</p>
                <p><strong>Booking Reference:</strong> ${bookingDetails.bookingId}</p>
              </div>
              <p>Thank you for choosing SerendibGo! We're excited to be part of your Sri Lankan adventure.</p>
              <p>You can view your booking details and manage your trip in your dashboard.</p>
            </div>
            <div class="footer">
              <p>If you have any questions, please contact our support team.</p>
              <p>&copy; 2024 SerendibGo. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      email,
      subject: 'Booking Confirmation - SerendibGo',
      html
    });
  }
}

module.exports = new EmailService();

