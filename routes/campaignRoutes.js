const express = require('express');
const router = express.Router();
const { 
    scheduleCampaign, 
    updateFollowUpSettings, 
    previewEmail
} = require('../controllers/campaignController');

// POST /api/campaigns/schedule
router.post('/schedule', scheduleCampaign);
router.patch('/follow-up', updateFollowUpSettings);

// POST /api/campaigns/preview
router.post("/preview", previewEmail);

module.exports = router;