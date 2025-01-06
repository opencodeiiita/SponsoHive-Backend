
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_API_KEY);
const EmailReply = require("../models/emailReply.js");
const Recipient = require("../models/Recipient.js");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@example.com',
    pass: 'your-email-password',
  },
});

const sendFollowUpEmail = async (email, campaign) => {
  const mailOptions = {
    from: 'your-email@example.com',
    to: email,
    subject: `Follow-up: ${campaign.name}`,
    text: `Dear User,\n\nWe noticed you haven't responded to our initial email about the campaign "${campaign.name}". We wanted to follow up to see if you're still interested.\n\nBest regards,\nYour Campaign Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Follow-up email sent to: ${email}`);
  } catch (error) {
    console.error(`Error sending follow-up email: ${error.message}`);
  }
};

// send mail using sendgrid

const sendEmail = async (recipientId, campaignId, subject) => {

  const emailReply = await EmailReply.create({recipientId , campaignId , messageId:"efbhcdj"}); // add unique message id for each email
  const recipient = await Recipient.create({firstName:"abc" , email:recipientId}); // recipient name

  try {
    await sgMail.send({
        personalizations: [
            {
                to: [{ email: recipientId }],
                custom_args: {
                    message_id: 'wdhdbha' //add unique message id for handling event webhook
                }
            }
        ],
        from: campaignId,
        subject: 'Email from SponsoHive',
        text: 'This is a test email to check if emails are being sent correctly.', // Use `text` instead of `body`
        html: '<p>This is a test email to check if emails are being sent correctly.</p>' // Optionally add HTML content
    });

    res.status(200).send('Email sent successfully.');
} catch (error) {
    console.error('Failed to send email:', error.response.body.errors || error.message);
    res.status(500).send('Failed to send email. Please try again later.');
}
};

module.exports = { sendFollowUpEmail };
