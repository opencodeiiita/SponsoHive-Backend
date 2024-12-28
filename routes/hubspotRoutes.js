const express = require("express");
const { fetchAccessToken } = require("../middleware/hubspotMiddleware");
const { handleHubspotOauth , getAccessToken , fetchContactLists, syncNewContact, updateContact, testIntegration} = require("../controllers/hubspotController.js");

const router = express.Router();

router.get("/authenticate",handleHubspotOauth); // Route to handle HubSpot OAuth
router.get("/authorize",getAccessToken); // Redirect URL to get access tokens and save them to the database
router.get("/contact-lists",fetchAccessToken,fetchContactLists); // Route to fetch contact lists from HubSpot
router.post("/sync-new-contact",fetchAccessToken,syncNewContact); // Route to sync new contacts created in SponsoHive
router.post("/update-contact",fetchAccessToken,updateContact); // Route to update contact information bidirectionally
router.get("/test-integration",fetchAccessToken,testIntegration); // Route to test integration with HubSpot

module.exports = router;
