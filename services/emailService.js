
const nodemailer = require('nodemailer');

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

module.exports = { sendFollowUpEmail };
