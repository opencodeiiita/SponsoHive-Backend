const User = require("../models/User");
const crypto = require("crypto");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.EMAIL_API_KEY);

const getVerificationStatus = async (req, res) => {

    const userId = req.params.userId;
    console.log(userId);

    const user = await User.findOne({_id: userId});
    if (!user) {
        return res.status(404).json({ error: 'User not found' });    
    }

    return res.status(200).json({ verified: user.verified });

}

const sendVerificationEmail = async (req, res) => {

    const {userId,userEmail} = req.body;

    if(!userId || !userEmail) {
        return res.status(400).json({ error: 'User ID and email are required' });
    }

    const token = crypto.randomBytes(32).toString('hex');

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    user.verificationToken = token;
    await user.save();

    const verificationUrl = `https://sponsohive.com/verify-sender?token=${token}`; // Replace with your app's URL

    await sgMail.send({
        to: userEmail,
        from: 'rbir3438@gmail.com',
        subject: 'Verify Your Sender Account',
        html: `<p>Click the link below to verify your sender account:</p>
               <a href="${verificationUrl}">${verificationUrl}</a>`,
    });

    return res.status(200).json({ message: 'Verification email sent successfully' });

}

const senderVerificationWebhook = async (req, res) => {

    try {

        const {email,url} = req.body[0];

        const urlParams = new URLSearchParams(new URL(url).search);
        const token = urlParams.get('token');
        if (!token) {
            return res.status(400).json({ error: 'Token not found' });
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if(user.verificationToken !== token) {
            return res.status(400).json({ error: 'Invalid token' });
        }

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();

        return res.status(200).json({ message: 'Sender account verified successfully' });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = {
    sendVerificationEmail, 
    senderVerificationWebhook,
    getVerificationStatus 
};