const express = require('express');
const router = express.Router();
const { scheduleCampaign, updateFollowUpSettings} = require('../controllers/campaignController');

// POST /api/campaigns/schedule
router.post('/schedule', scheduleCampaign);
router.patch('/follow-up', updateFollowUpSettings);

module.exports = router;