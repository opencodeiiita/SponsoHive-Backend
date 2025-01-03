const axios = require('axios');
const qs = require('qs');
const dotenv = require('dotenv');
const { generateCodeVerifier, generateCodeChallenge } = require('../utils/crmHelper.js');

dotenv.config();

const SALESFORCE_CLIENT_ID = process.env.SALESFORCE_CLIENT_ID;
const SALESFORCE_CLIENT_SECRET = process.env.SALESFORCE_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:5000/api/crm/callback';
const SALESFORCE_TOKEN_URL = process.env.SALESFORCE_TOKEN_URL || 'https://login.salesforce.com/services/oauth2/token';
const SALESFORCE_AUTH_URL = process.env.SALESFORCE_AUTH_URL || 'https://login.salesforce.com/services/oauth2/authorize';

let codeVerifier;

const login = async (req, res) => {

  // Generate Code Verifier and Code Challenge
  codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const authorizationUrl = `${SALESFORCE_AUTH_URL}?response_type=code&client_id=${SALESFORCE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  res.redirect(authorizationUrl);

};

const callback = async (req, res) => {

  const authorizationCode = req.query.code;
  console.log(authorizationCode);

  if (!authorizationCode) {
    return res.status(400).send('Authorization code is missing.');
  }

  try {

    const tokenResponse = await axios.post(
      SALESFORCE_TOKEN_URL,
      qs.stringify({
        grant_type: 'authorization_code',
        client_id: SALESFORCE_CLIENT_ID,
        client_secret: SALESFORCE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code: authorizationCode,
        code_verifier: codeVerifier,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    res.status(200).json(tokenResponse.data);

  } 
  catch (error) {
    console.error('Error during token exchange:', error);
    res.status(500).send('Token exchange failed.');
  }
};

const importContacts = async (req, res) => {

  const token = req.body.token;

  if (!token) {
    return res.status(401).send('User is not authenticated.');
  }

  try {

    const response = await axios.get(
      `${token.instance_url}/services/data/v57.0/query/?q=SELECT+Id,Name,Email+FROM+Contact`,
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      }
    );

    const contacts = response.data.records;
    res.json(contacts);

  } 
  catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).send('Failed to fetch contacts from Salesforce.');
  }
};

const syncCampaignResults = async (req, res) => {

  const token = req.body.token;

  if (!token) {
    return res.status(401).send('User is not authenticated.');
  }

  const { campaignId, openRate, clickThroughRate } = req.body;

  try {

    await axios.patch(
      `${token.instance_url}/services/data/v57.0/sobjects/Campaign/${campaignId}`,
      {
        OpenRate__c: openRate,
        ClickThroughRate__c: clickThroughRate,
      },
      {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.send('Campaign results synced successfully.');

  } 
  catch (error) {
    console.error('Error syncing campaign results:', error);
    res.status(500).send('Failed to sync campaign results to Salesforce.');
  }
};

module.exports = {
  login,
  callback,
  importContacts,
  syncCampaignResults,
};
