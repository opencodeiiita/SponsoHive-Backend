const analytics = require("../models/Analytics");

// updates response data in campaign analytics
const updateResponseRate = async (campaignId) => {
    try {
        const recipient = await analytics.findOne({ campaignId });
        if (recipient) {
            recipient.totalReplies = recipient.totalReplies + 1;
            recipient.responseRate = (recipient.totalReplies / recipient.emailsSent) * 100;
            await recipient.save();
        }
    } catch (error) {
        console.error(error);
    }
};

// provide campaign analytics
const getAnalytics = async (req, res) => {
    const campaignId = req.params.campaignId;
    try {
        const analyticsData = await analytics.findOne({ campaignId });
        res.status(200).json(analyticsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve analytics data.' });
    }
};

module.exports = { updateResponseRate , getAnalytics };