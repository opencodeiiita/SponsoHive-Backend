const dotenv = require('dotenv');
const Twitter = require('twitter-v2');
const SocialMedia = require('../models/socialMedia');
const Integration = require('../models/integration');

dotenv.config();
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

const twitterClient = new Twitter({
    bearer_token: BEARER_TOKEN,
});

const fetchTwitterUserData = async (req, res) => {
    const { username, userEmail } = req.params;
    
    if (!username || !userEmail) {
        return res.status(400).json({ error: 'Username and email are required' });
    }

    try {
        // Twitter API request for user by username
        const response = await twitterClient.get(`users/by/username/${username}`);

        // Check for a successful response
        if (response && response.data) {
            // Find or create a user and update the twitterProfile information
            const updatedUser = await SocialMedia.findOneAndUpdate(
                { email: userEmail },  // Find the user by email
                {
                    $set: {
                        'twitter.username': response.data.username,
                        'twitter.name': response.data.name,
                        'twitter.bio': response.data.description || '',
                        'twitter.location': response.data.location || '',
                        'twitter.profileURL': `https://x.com/${response.data.username}`,
                        'twitter.company': extractCompanyFromBio(response.data.description) || '',
                    },
                    updatedAt: new Date(), // Update the timestamp
                },
                { new: true, upsert: true } // `new: true` returns the updated document; `upsert: true` creates a new one if not found
            );

            updateIntegration(userEmail, response.data);

            return res.status(200).json({
                message: 'User Twitter data updated successfully',
                user: updatedUser.twitter,
            });

        }

        throw new Error('Failed to fetch user data from Twitter');
    } catch (error) {
        console.error('Error fetching Twitter data:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

const extractCompanyFromBio = (bio) => {
    if (bio) {
        const companyKeywords = ['@', 'company', 'inc', 'ltd'];
        const matchedCompany = companyKeywords.find((keyword) => bio.includes(keyword));
        return matchedCompany || null;
    }
    return null;
};

const updateIntegration = async(userEmail,response) => {

    console.log("twitter");

    await Integration.updateOne({userEmail:userEmail},
        {
            $set: {
            userEmail: userEmail,
            integrationName: 'Twitter',
            type:'data',
            lastSync: new Date(),
            data: {
                username: response.username,
                name: response.name,
                bio: response.description || '',
                location: response.location || '',
                profileURL: `https://x.com/${response.username}`,
            }
        }
    },{
        upsert: true,
    })

};


module.exports = { fetchTwitterUserData };