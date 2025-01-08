require('dotenv').config();
const axios = require('axios');
const qs = require('qs');
const HubspotToken = require('../models/hubspotToken');
const Integration = require("../models/integration");

const CLIENT_ID = process.env.HUBSPOT_CLIENT_ID;
const CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET;
const REDIRECT_URI = process.env.HUBSPOT_REDIRECT_URI;
const HUBSPOT_API_URL = process.env.HUBSPOT_API_URL || 'https://api.hubapi.com';


// Authenticate users to securely connect SponsoHive accounts with HubSpot
const handleHubspotOauth = async (req, res) => {

    if (!CLIENT_ID || !REDIRECT_URI) {
        return res.status(500).send('Missing environment variables.');
    }

    const userId = req.body.userId;
    if(!userId) {
        return res.status(400).send('User ID is required.');
    }
    const state = encodeURIComponent(userId);
    const token = await HubspotToken.create({ userId , state});

    await token.save();

    const scopes = 'crm.objects.contacts.write%20oauth%20crm.lists.write%20crm.lists.read%20crm.objects.contacts.read';

    const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${CLIENT_ID}&scope=${scopes}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${state}`;
    res.redirect(authUrl);
};

// Handle callback from HubSpot and save tokens
const getAccessToken = async (req, res) => {
    const { code, state } = req.query;
    if (!code || !state) {
        return res.status(400).json({ message: "Missing code or state parameter." });
    }

    try {
        const tokenResponse = await axios.post(`${HUBSPOT_API_URL}/oauth/v1/token`, qs.stringify({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: code,
        }),
        {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const userId = decodeURIComponent(state);
        const user = await HubspotToken.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        await user.updateOne({
            access_token: tokenResponse.data.access_token,
            refresh_token: tokenResponse.data.refresh_token,
            expires_in: new Date(Date.now() + tokenResponse.data.expires_in * 1000),
        });

        await Integration.updateOne({userEmail:userId}, {
            $set : {
                userId:userId,
                integrationName:"HubSpot",
                type:"oauth",
                lastSync: new Date(),
                token: {
                    accessToken: tokenResponse.data.access_token,
                    refreshToken: tokenResponse.data.refresh_token,
                    tokenExpiry: new Date(Date.now() + tokenResponse.data.expires_in * 1000),
                },
        }
    },{upsert:true});

        console.log(tokenResponse.data);
        res.send('Authentication successful! Tokens stored.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching access token.');
    }
};

const refreshAccessToken = async (refresh_token) => {
    try {
        const response = await axios.post(`${HUBSPOT_API_URL}/oauth/v1/token`, {
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token,
        });

        return response.data;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw new Error('Failed to refresh access token.');
    }
};


// Fetch contact lists from HubSpot
const fetchContactLists = async (req, res) => {
    try {
        const response = await axios.get(`${HUBSPOT_API_URL}/contacts/v1/lists`, {
            headers: {
                Authorization: `Bearer ${req.access_token}`, // Use token from middleware
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching contact lists:', error);
        res.status(500).send('Failed to fetch contact lists.');
    }
};


// Sync new contacts from SponsoHive to HubSpot
const syncNewContact = async (req, res) => {
    const { email, firstName, lastName } = req.body;

    if (!email || !firstName || !lastName) {
        return res.status(400).json({ message: 'Missing required contact fields.' });
    }

    try {
        const response = await axios.post(`${HUBSPOT_API_URL}/crm/v3/objects/contacts`, {
            properties: {
                email,
                firstname: firstName,
                lastname: lastName,
            },
        }, {
            headers: {
                Authorization: `Bearer ${req.access_token}`,
                'Content-Type': 'application/json',
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error syncing new contact:', error);
        res.status(500).send('Failed to sync new contact.');
    }
};

// Update contact information bidirectionally
const updateContact = async (req, res) => {
    const { contactId, updates } = req.body;

    if (!contactId || !updates) {
        return res.status(400).json({ message: 'Missing contact ID or updates.' });
    }

    try {
        const response = await axios.patch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/${contactId}`, {
            properties: updates,
        }, {
            headers: {
                Authorization: `Bearer ${req.access_token}`,
                'Content-Type': 'application/json',
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).send('Failed to update contact.');
    }
};

// Test integration with various HubSpot accounts and data sizes
const testIntegration = async (req, res) => {
    try {
        // Make the request to HubSpot API to fetch contacts
        const response = await axios.get(`${HUBSPOT_API_URL}/crm/v3/objects/contacts`, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
            params: {
                limit: 10,
            },
        });

        // If the request is successful, return the data
        res.json(response.data);
    } catch (error) {
        console.error('Error testing integration:', error);

        // Handle different types of errors with clear feedback
        if (error.response) {
            // The request was made, but the server responded with an error
            const statusCode = error.response.status;
            const message = error.response.data.message || 'An error occurred on the server.';
            res.status(statusCode).json({
                message: `HubSpot API Error: ${message}`,
                status: statusCode,
            });
        } else if (error.request) {
            // The request was made but no response was received (e.g., network issues)
            res.status(503).json({
                message: 'Network error: Unable to reach the HubSpot API. Please check your connection.',
                status: 503,
            });
        } else {
            // An unknown error occurred (e.g., invalid code, internal error in your logic)
            res.status(500).json({
                message: 'An unexpected error occurred while testing the integration.',
                status: 500,
            });
        }
    }
};


module.exports = {
    handleHubspotOauth,
    getAccessToken,
    refreshAccessToken,
    fetchContactLists,
    syncNewContact,
    updateContact,
    testIntegration,
};
