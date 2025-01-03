const express = require('express');
const {
  login,
  callback,
  importContacts,
  syncCampaignResults,
} = require('../controllers/crmIntegrationController.js');

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/import-contacts', importContacts);
router.post('/sync-campaign-results', syncCampaignResults);

module.exports = router;