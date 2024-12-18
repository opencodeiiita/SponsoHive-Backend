const express = require('express');
const router = express.Router();
const { scheduleCampaign } = require('../controllers/campaignController');

// POST /api/campaigns/schedule
router.post('/schedule', scheduleCampaign);

module.exports = router;
