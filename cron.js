const cron = require('node-cron');
const { checkAndSendFollowUpEmails } = require('./services/emailListService');
const { deactivateInvalidContacts } = require('./controllers/trackingController');

cron.schedule('0 0 * * *', () => {
  console.log('Running follow-up email check...');
  checkAndSendFollowUpEmails();
});

cron.schedule('0 0 * * *', () => {
  console.log('Running invalid contact deactivation...');
  deactivateInvalidContacts();
})