// routes/testRoutes.js

const express = require('express');
const router = express.Router();
const {authMiddleware} = require('../middleware/authMiddleware');  // Authentication Middleware
const roleMiddleware = require('../middleware/roleMiddleware');  // Role Middleware

const sendEmail = require('../utils/emailService'); // Import sendEmail function

// Test Route for RBAC Validation
router.get('/rbac', authMiddleware, roleMiddleware(['Admin']), (req, res) => {
  // If the user is authenticated and has the Admin role, this will run
  res.status(200).json({ message: 'Access granted. You are an Admin!' });
});


/**
 * Test route to send an email.
 * @route POST /test/send-email
 * @body {string} to - Recipient's email address.
 * @body {string} subject - Subject of the email.
 * @body {string} body - Email content.
 * @body {Array<Object>} [attachments] - Optional attachments.
 */
router.post('/send-email', async (req, res) => {
  const { to, subject, body, attachments = [] } = req.body;

  if (!to || !subject || !body) {
    return res.status(400).send('Parameters "to", "subject", and "body" are required.');
  }

  try {
    const result = await sendEmail({ to, subject, body, attachments });
    res.status(200).json({ message: 'Email sent successfully.', result });
  } catch (error) {
    console.error('Error sending email:', error.message);
    res.status(500).json({ message: 'Failed to send email.', error: error.message });
  }
});


module.exports = router;
