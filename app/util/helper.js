const sgMail = require('@sendgrid/mail');
const otpGenerator = require("otp-generator");

// Set your SendGrid API key (use environment variable for security)
sgMail.setApiKey(process.env.SENDGRID_API_KEY || 'YOUR_SENDGRID_API_KEY_HERE');

class MyHelper {
  static resHandler = (res, statusCode, apiStatus, data, message) => {
    res.status(statusCode).send({
      apiStatus,
      data,
      message,
    });
  };

  static emailHandler = (mail) => {
    return new Promise((resolve, reject) => {
      const otp = otpGenerator.generate(4, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      // SendGrid email configuration
      const msg = {
        to: mail, // Recipient email
        from: process.env.VERIFIED_SENDER_EMAIL,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset OTP</h2>
            <p>Hello,</p>
            <p>You requested a password reset. Your OTP code is:</p>
            <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 3px; margin: 20px 0;">
              ${otp}
            </div>
            <p><strong>Note:</strong> This OTP is valid for a limited time only.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <hr style="margin-top: 30px;">
            <p style="font-size: 12px; color: #666;">This is an automated email, please do not reply.</p>
          </div>
        `
      };

      // Send email using SendGrid
      sgMail
        .send(msg)
        .then((response) => {
          resolve({
            apiStatus: true,
            data: {
              messageId: response[0].headers['x-message-id'],
              statusCode: response[0].statusCode
            },
            otp: otp,
          });
        })
        .catch((error) => {
          console.error('❌ Error sending email:', error.message);
          if (error.response) {
            console.error('SendGrid Error Details:', error.response.body);
          }
          reject({
            apiStatus: false,
            data: null,
            message: "Error sending email: " + error.message,
          });
        });
    });
  };

  static accountStatusEmail = (mail, isEnabled) => {
    return new Promise((resolve, reject) => {
      const subject = isEnabled
        ? "Your Account Has Been Enabled"
        : "Your Account Has Been Disabled";

      const message = isEnabled
        ? `
        <h2 style="color: #333;">Account Enabled</h2>
        <p>Hello,</p>
        <p>We’re happy to inform you that your account has been <strong>enabled</strong>. You can now log in and access the platform.</p>
        <p>Welcome back!</p>
      `
        : `
        <h2 style="color: #333;">Account Disabled</h2>
        <p>Hello,</p>
        <p>We’re writing to let you know that your account has been <strong>disabled</strong>. Please contact support for more information.</p>
      `;

      const msg = {
        to: mail,
        from: process.env.VERIFIED_SENDER_EMAIL,
        subject,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          ${message}
          <hr style="margin-top: 30px;">
          <p style="font-size: 12px; color: #666;">This is an automated email, please do not reply.</p>
        </div>
      `,
      };

      sgMail
        .send(msg)
        .then((response) => {
          resolve({
            apiStatus: true,
            data: {
              messageId: response[0].headers["x-message-id"],
              statusCode: response[0].statusCode,
            },
          });
        })
        .catch((error) => {
          console.error("❌ Error sending email:", error.message);
          if (error.response) {
            console.error("SendGrid Error Details:", error.response.body);
          }
          reject({
            apiStatus: false,
            data: null,
            message: "Error sending email: " + error.message,
          });
        });
    });
  };


  static checkIsObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  static calculateDiffTime = (sessionStart) => {
    const startTime = new Date(sessionStart);
    const endTime = new Date();
    const diffInMilliseconds = endTime - startTime;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return parseFloat(diffInHours.toFixed(2));
  };

  // Test function to verify SendGrid is working
  static testSendGrid = async (testEmail) => {
    try {
      console.log('🧪 Testing SendGrid configuration...');
      const result = await MyHelper.emailHandler(testEmail);
      console.log('✅ SendGrid test successful!', result);
      return result;
    } catch (error) {
      console.error('❌ SendGrid test failed:', error);
      return error;
    }
  };
}

module.exports = MyHelper;