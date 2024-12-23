const nodemailer = require('nodemailer');
const dotenv = require("dotenv"); // For Testing
dotenv.config();

// Configure the transporter for Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // Sender's email address
    pass: process.env.EMAIL_PASS, // App password for Gmail
  },
});

/**
 * Send an email using the configured transporter.
 * @param {Object} options - Email options.
 * @param {string} options.to - Recipient's email address.
 * @param {string} options.subject - Subject of the email.
 * @param {string} options.body - Email body content.
 * @param {Array<Object>} [options.attachments] - Attachments for the email.
 * @returns {Promise<void>}
 */

async function sendEmail({ to, subject, body, attachments = [] }) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // Recipient address
      subject, // Subject line
      text: body, // Plain text body
      attachments, // Attachments (optional)
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info; 
  } 
  catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    throw new Error(`Failed to send email to ${to}: ${error.message}`);
  }
}

module.exports = sendEmail;
