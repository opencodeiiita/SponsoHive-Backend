const Campaign = require('../models/Campaign');
const { scheduleCampaign } = require('../utils/schedulerService');

/**
 * Schedule a new campaign.
 */
exports.scheduleCampaign = async (req, res) => {
  try {
    const { name, emailListId, schedule } = req.body;

    // Validate inputs
    if (!name || !emailListId || !schedule) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Create a new campaign
    const campaign = new Campaign({
      name,
      emailListId,
      schedule: new Date(schedule),
    });

    await campaign.save();

    // Schedule the campaign
    scheduleCampaign(campaign);

    return res.status(201).json({
      message: 'Campaign scheduled successfully.',
      campaign,
    });
  } catch (error) {
    console.error('Error scheduling campaign:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
