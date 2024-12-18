const sendEmail = require('../utils/emailService');

const testEmail = {
  to: 'RECEIPENT@gmail.com', // Replace with an actual email
  subject: 'Test Email from SponsoHive',
  body: 'This is a test email to check if emails are being sent correctly.',
};

sendEmail(testEmail)
  .then((info) => {
    console.log('Email sent successfully:', info.response);
  })
  .catch((error) => {
    console.error('Failed to send email:', error.message);
  });
