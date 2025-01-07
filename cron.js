const cron = require('node-cron');
const { checkAndSendFollowUpEmails } = require('./services/emailListService');
const { checkExpiryTokens } = require('./controllers/integrationController');

cron.schedule('0 0 * * *', () => {
  console.log('Running follow-up email check...');
  checkAndSendFollowUpEmails();
});







cron.schedule('0 0 * * *', () => {
  console.log('Checking for tokens which are about to expire...');
  checkExpiryTokens();
});