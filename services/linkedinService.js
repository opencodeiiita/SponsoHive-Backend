const axios = require('axios');
const User = require('../models/User');
const SocialMedia = require('../models/socialMedia');
const querystring = require('querystring');
const dotenv = require('dotenv');
dotenv.config();
const Integration = require('../models/integration');

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const LINKEDIN_REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

const handleLinkedinAuth = async (req, res) => {

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        scope: 'profile email openid',
    })}`;
    // res.redirect(authUrl);
    res.send(authUrl);
}

const handleLinkedinCallback = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send('Authorization code not provided.');
    }

    try {
        // Step 1: Exchange the authorization code for an access token
        const tokenResponse = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', querystring.stringify({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: LINKEDIN_REDIRECT_URI,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const accessToken = tokenResponse.data.access_token;
        console.log('Access Token:', accessToken);
        // res.send(accessToken);

        // Step 2: Fetch LinkedIn profile data
        const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!profileResponse.data) {
            return res.status(400).send('Failed to fetch LinkedIn profile data.');
        }

        // Step 3: Fetch email address (if scope includes it)
        // const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
        //     headers: { 'Authorization': `Bearer ${accessToken}` },
        // });

        const email = profileResponse.data.email;

        // Check if the user has enabled social media integration (this should be part of your user model)
        const user = await User.findOne({ email: email }); // Assuming you have a User model
        if (user) {
            usersocialMediaEnabled = true;
            await user.save();
        }

        // Step 4: Create or update SocialMedia entry in the database
        const socialMediaAccount = await SocialMedia.findOneAndUpdate(
            { email: email }, // Check if this email already exists
            {
                email: email,
                linkedin: {
                    name : profileResponse.data.name,
                    email_verified: profileResponse.data.email_verified,
                    picture: profileResponse.data.picture
                },
                updatedAt: new Date(),
            },
            { new: true, upsert: true } // If not found, create new
        );

        updateIntegration(email,profileResponse);

        res.json({
            message: 'Social media account saved successfully!',
            socialMediaAccount,
        });

    } catch (error) {
        console.error('Error during LinkedIn OAuth flow:', error);
        res.status(500).send('Internal server error');
    }
};

const updateIntegration = async(userId,profileResponse) => {

    await Integration.updateOne({
        userEmail: userId,
        integrationName: 'linkedin',
        type:'data',
        lastSync: new Date(),
        data: {
            name: profileResponse.data.name,
            email_verified: profileResponse.data.email_verified,
            picture: profileResponse.data.picture
        }
    },{
        upsert: true,
    })

};



module.exports = {
    handleLinkedinAuth,
    handleLinkedinCallback,
}