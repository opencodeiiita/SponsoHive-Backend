const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const sendEmail = require('../utils/emailService'); // Custom email sending function

const router = express.Router();

async function sendEmailWithAttachment(recipient, subject, body, attachments) {
    try {
      await sendEmail({ to: recipient, subject, body, attachments});
      console.log('Email sent with attachment.');
    } 
    catch (error) {
      console.error('Failed to send email:', error.message);
    }
  }

router.post('/', upload.single('file'), (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    } 

    //This logic here is used to demonstrate where to access the uploaded file url and how to send the email.

    const recipient = 'your-mail@gmail.com';
    const subject = 'Your Uploaded Document';
    const body = 'Please find your uploaded document attached below.';
    const attachments = [
        {
            filename: 'uploaded-document.pdf', // Optional: Change to the desired filename
            path: req.file.path, // Cloudinary file URL
        },
    ];

    sendEmailWithAttachment(recipient, subject, body, attachments);

    res.status(200).json({
    message: 'File uploaded successfully.',
    url: req.file.path,
    public_id: req.file.filename, // Optional: Include the Cloudinary public ID for debugging
  });

});

module.exports = router;
