const Tokens = require('../models/hubspotToken');
const { refreshAccessToken } = require('../controllers/hubspotController');

const fetchAccessToken = async (req, res, next) => {
    const { userId } = req.body; // Assuming `userId` is provided in the request body

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
    }

    try {
        // Retrieve the tokens from the database
        const record = await Tokens.findOne({ userId });

        if (!record) {
            return res.status(404).json({ message: 'No tokens found for the user.' });
        }

        const { access_token, refresh_token, expires_in } = record;

        // Check if the access token is expired
        if (new Date(expires_in) < new Date()) {
            console.log('Access token expired, refreshing...');
            // Access token expired, so refresh it
            const newTokens = await refreshAccessToken(refresh_token);

            // Update the database with the new access token and expiration date
            await Tokens.updateOne(
                { userId },
                {
                    access_token: newTokens.access_token,
                    expires_in: new Date(Date.now() + newTokens.expires_in * 1000), 
                }
            );

            // Attach the refreshed token to the request object
            req.access_token = newTokens.access_token;
        } else {
            // If token is still valid, attach it to the request object
            req.access_token = access_token;
        }
        next();
    } catch (error) {
        console.error('Error in token middleware:', error);
        res.status(500).json({ message: 'Failed to verify and refresh access token.' });
    }
};

module.exports = {fetchAccessToken};
