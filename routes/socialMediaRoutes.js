const express = require("express");
const { handleLinkedinAuth , handleLinkedinCallback } = require("../services/linkedinService");
const { fetchTwitterUserData } = require("../services/twitterService");
const SocialMedia = require("../models/socialMedia");

const router = express.Router();

router.get("/linkedin/authorize", handleLinkedinAuth); // Route to allow users to authenticate with LinkedIn
router.get("/linkedin/callback", handleLinkedinCallback); // Route to handle LinkedIn OAuth callback and retrieve user data

router.get("/twitter/:username/:userEmail", fetchTwitterUserData); // Route to fetch user data from Twitter

// Route to disable social media integration and delete associated data
router.post("/disable", async (req, res) => {
    const { email } = req.body; // Get the user's email from the request body

    if (!email) {
        return res.status(400).send('Email address is required.');
    }

    try {
        // Step 1: Find the user and disable social media integration
        const user = await User.findOneAndUpdate(
            { email: email }, 
            { socialMediaEnabled: false }, // Disable social media integration
            { new: true } // Return the updated user
        );

        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Step 2: Delete the user's social media data from the SocialMedia collection
        await SocialMedia.findOneAndDelete({ email: email });

        res.json({
            message: 'Social media integration disabled, and associated data deleted successfully.',
        });
    } catch (error) {
        console.error('Error disabling social media integration:', error);
        res.status(500).send('Internal server error');
    }
});




module.exports = router;