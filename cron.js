const cron = require('node-cron');
const { checkAndSendFollowUpEmails } = require('./services/emailListService');

cron.schedule('0 0 * * *', () => {
  console.log('Running follow-up email check...');
  checkAndSendFollowUpEmails();
});