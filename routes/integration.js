const express = require("express");
const { getAllIntegrations , deactivateIntegration , getIntegrationStatus , checkExpiryTokens} = require("../controllers/integrationController");

const router = express.Router();

router.get("/fetch/:userEmail", getAllIntegrations); // Route to get all active integrations

router.get("/status/:integrationId", getIntegrationStatus); // Route to get the status of an integration

router.delete("/deactivate/:integrationId", deactivateIntegration); // Route to remove an integration

router.get("/expiry-tokens", checkExpiryTokens); // Route to check for tokens which are about to expire

module.exports = router;