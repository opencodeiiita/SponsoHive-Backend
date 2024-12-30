const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const Recipient = require('../models/RecepientModel'); // Import Recipient model

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
    // Check recipient's status or create a new recipient entry if not found
    let recipient = await Recipient.findOne({ email: to });
    if (!recipient) {
      recipient = await Recipient.create({ email: to, status: 'Active' });
      console.log(`Recipient ${to} added to the database.`);
    }

    if (recipient.status === 'Unsubscribed') {
      console.log(`Email not sent to ${to}: Recipient is unsubscribed.`);
      return;
    }

    // Add an unsubscribe link to the email body
    const unsubscribeLink = `${process.env.BASE_URL}/unsubscribe?email=${encodeURIComponent(to)}`;
    const emailBody = `${body}\n\nIf you wish to unsubscribe, click here: ${unsubscribeLink}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: emailBody,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);

    // Update the recipient's status to 'Bounced' if sending fails
    await Recipient.updateOne(
      { email: to },
      { $set: { status: 'Bounced', updatedAt: new Date() } }
    );
    throw new Error(`Failed to send email to ${to}: ${error.message}`);
  }
}

module.exports = sendEmail;
