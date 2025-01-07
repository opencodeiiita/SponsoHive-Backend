const Integration = require('../models/integration');
const { notifyUserOfExpiringToken , notifyUserOfFailedSync} = require('../services/socketService');

const getAllIntegrations = async (req, res) => {

    const userEmail = req.params.userEmail;
    try {
        const integrations = await Integration.find({ userEmail: userEmail , status:"Active"});
        res.status(200).json(integrations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching integrations' });
    }

}

const getIntegrationStatus = async (req, res) => {

    const integrationId = req.params.integrationId;
    try {
        const integration = await Integration.findOne({ _id: integrationId });
        if (!integration) {
            return res.status(404).json({ error: 'Integration not found' });
        }
        res.status(200).json(integration);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching integration status' });
    }

}

const deactivateIntegration = async (req, res) => {

    const integrationId = req.params.integrationId;
    try {
        const integration = await Integration.findOneAndDelete({ _id: integrationId });
        if (!integration) {
            return res.status(404).json({ error: 'Integration not found' });
        }
        res.status(200).json({ message: 'Integration deactivated successfully ' , integration});
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error removing integration' });
    }

}

const checkExpiryTokens = async (req,res) => {
    try {
      // Fetch all integrations
      const integrations = await Integration.find();
  
      // Loop through each integration
      for (const integration of integrations) {
        if (integration.type === "oauth" && integration.token.tokenExpiry) {
          const tokenExpiry = new Date(integration.token.tokenExpiry);
          const currentDate = new Date();
  
          // Calculate the difference in days
          const timeDiff = (tokenExpiry - currentDate) / (1000 * 60 * 60 * 24);
  
          if (timeDiff < 0) {
            // Token expired
            integration.status = "Inactive";
            await integration.save();
            console.log(`Token for user ${integration.userEmail} has expired and integration is deactivated.`);
          } else if (timeDiff > 0 && timeDiff < 2) {
            // Token will expire in less than 2 days

            // const message = `Token will expire in ${Math.ceil(timeDiff)} days.`;
            // await notifyUserOfExpiringToken(integration.userEmail, message);

            const message = `Sync Failed for salesforce CRM integration.`;
            await notifyUserOfFailedSync(integration.userEmail,message);

            console.log(`Notification sent to ${integration.userEmail}: ${message}`);
          }
        }
      }
      res.status(200).json({message : "All integrations status has been updated"});
    } catch (error) {
      console.error("Error checking token expiry:", error);
    }
  };
  

module.exports = { 
    getAllIntegrations,
    deactivateIntegration,
    getIntegrationStatus,
    checkExpiryTokens
};