// services/emailListService.ts

import { EmailList } from '../models/EmailList';
import { Campaign } from '../models/Campaign';
import { sendFollowUpEmail } from './emailService'; 

export const checkAndSendFollowUpEmails = async () => {
  const campaigns = await Campaign.find({ status: 'active' });

  for (const campaign of campaigns) {
    const nonResponders = await EmailList.find({
      campaign: campaign._id,
      responded: false,
      lastEmailSent: { $lt: new Date(Date.now() - campaign.follow_up * 24 * 60 * 60 * 1000) }, // check for non-responders based on the follow-up interval
    });

    for (const nonResponder of nonResponders) {
      await sendFollowUpEmail(nonResponder.email, campaign);
      nonResponder.followUpSent = true; 
      await nonResponder.save();
    }
  }
};
