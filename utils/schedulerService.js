const schedule = require('node-schedule');
const Campaign = require('../models/Campaign');
const sendEmail = require('./emailService'); // Custom email sending function

const scheduledJobs = {};

/**
 * Schedule a campaign for a given time.
 * @param {Object} campaign - The campaign object to schedule.
 */

function scheduleCampaign(campaign) {

  const { _id, schedule: scheduledTime } = campaign;

  // Schedule job
  const job = schedule.scheduleJob(_id.toString(), scheduledTime, async () => {
    try {
      console.log(`Running campaign: ${campaign.name}`);

      // Fetch full campaign details
      const fullCampaign = await Campaign.findById(_id).populate('emailListId');

      if (!fullCampaign) {
        console.error('Campaign not found');
        return;
      }

      // Send emails (Iterate over email list)
      for (const email of fullCampaign.emailListId.emails) {
        await sendEmail({
          to: email,
          subject: `Campaign: ${fullCampaign.name}`,
          body: 'This is a scheduled campaign email.', // Placeholder for email body
        });
      }

      // Update status
      fullCampaign.status = 'Sent';
      await fullCampaign.save();

      console.log(`Campaign "${campaign.name}" sent successfully.`);

    } 
    catch (error) {
      console.error('Error while sending campaign:', error);

      // Update status on failure
      await Campaign.findByIdAndUpdate(_id, { status: 'Failed' });
    }
  });

  // Store reference to the job
  scheduledJobs[_id.toString()] = job;

  console.log(`Scheduled campaign "${campaign.name}" for ${scheduledTime}.`);
}

module.exports = { scheduleCampaign, scheduledJobs };
