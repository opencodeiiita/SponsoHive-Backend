const EmailTracking = require("../models/emailTracking.js");

//This will generate a unique tracking url and save it to the database. This url will be embedded in the email and 
// will be used to track the email open events
const handleGenerateTrackingURL = async (req, res) => {
    const { recipientId, campaignId, targetUrl } = req.body;

    if (!recipientId || !campaignId || !targetUrl) {
        return res.status(400).json({ error: 'recipientId, campaignId, and targetUrl are required.' });
    }


    const encodedTargetUrl = encodeURIComponent(targetUrl);

    const trackingUrl = `https://yourdomain.com/api/analytics/track?recipientId=${recipientId}&campaignId=${campaignId}&targetUrl=${encodedTargetUrl}`;

    try {
        let emailTracking = await EmailTracking.findOne({ recipientId, campaignId });

        if (!emailTracking) {
            emailTracking = new EmailTracking({
                recipientId,
                campaignId,
                trackingurls: [trackingUrl],
                clicks: [0],
            });
        } else {
            emailTracking.trackingurls.push(trackingUrl);
            emailTracking.clicks.push(0); 
        }

        
        await emailTracking.save();

        return res.status(200).json({ trackingUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate tracking URL.' });
    }
};



//This function will track the email open events and save time of email open
const handleEmailTracking = async (req, res) => {
  const { recipientId, campaignId } = req.query;

  if (!recipientId || !campaignId) {
      return res.status(400).send('Invalid tracking data.');
  }

  console.log(`Email opened by Recipient ID: ${recipientId}, Campaign ID: ${campaignId}`);

  try {
      // Look for the email tracking data in the database
      const emailTracking = await EmailTracking.findOne({ recipientId, campaignId });
      if (!emailTracking) {
          return res.status(400).send('Invalid tracking data.');
      }

      // Update the timestamp to the current time
      emailTracking.timestamp = new Date();
      await emailTracking.save();

      // Return a transparent 1x1 pixel image
      const transparentPixel = Buffer.from(
          '89504e470d0a1a0a0000000d49484452000000010000000101020000000000000000',
          'hex'
      );
      res.status(200).type('image/png').send(transparentPixel);
      
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
  }
};


//click increment
const handleLogClick = async (req, res) => {
    const { recipientId, campaignId, targetUrl } = req.query;

    if (!recipientId || !campaignId || !targetUrl) {
        return res.status(400).json({ error: 'Invalid click data.' });
    }

    try {
        
        const emailTracking = await EmailTracking.findOne({ recipientId, campaignId });

        if (!emailTracking) {
            return res.status(400).json({ error: 'Invalid tracking data.' });
        }

       
        const encodedTargetUrl = encodeURIComponent(targetUrl);
        console.log('Encoded Target URL:', encodedTargetUrl);
        console.log('Tracking URLs in DB:', emailTracking.trackingurls);
        const urlIndex = emailTracking.trackingurls.findIndex(url => url.includes(encodedTargetUrl));

        if (urlIndex === -1) {
            return res.status(400).json({ error: 'Target URL not found in the email.' });
        }
        emailTracking.clicks[urlIndex] += 1;
        emailTracking.timestamp = new Date(); 
        await emailTracking.save();

        res.status(200).json({ message: 'Click event logged successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to log click event.', details: error.message });
    }
};









// Get click count for a specific link
const handleGetClickCount = async (req, res) => {
    const { campaignId, recipientId, targetUrl } = req.query;

    if (!campaignId || !recipientId || !targetUrl) {
        return res.status(400).json({ error: 'Invalid query data.' });
    }

    try {
        const emailTracking = await EmailTracking.findOne({ recipientId, campaignId });

        if (!emailTracking) {
            return res.status(400).json({ error: 'Invalid tracking data.' });
        }

        const decodedTargetUrl = decodeURIComponent(targetUrl);
        console.log('Decoded Target URL:', decodedTargetUrl);
        console.log('Tracking URLs in DB:', emailTracking.trackingurls);

        const urlIndex = emailTracking.trackingurls.findIndex(url => {
            const urlObj = new URL(url);
            const params = new URLSearchParams(urlObj.search);
            const storedTargetUrl = params.get('targetUrl');
            return storedTargetUrl === decodedTargetUrl; 
        });

        if (urlIndex === -1) {
            return res.status(400).json({ error: 'Target URL not found in the email.' });
        }

        res.status(200).json({ clicks: emailTracking.clicks[urlIndex] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch click count.', details: error.message });
    }
};




// Get click-through rate for a campaign
const handleGetCTR = async (req, res) => {
    const { campaignId } = req.query;

    if (!campaignId) {
        return res.status(400).json({ error: 'Campaign ID is required.' });
    }

    try {
        const campaignLinks = await EmailTracking.find({ campaignId });

        if (campaignLinks.length === 0) {
            return res.status(404).json({ error: 'No links found for this campaign.' });
        }

        let totalClicks = 0;
        let totalEmailsSent = campaignLinks.length;

        campaignLinks.forEach((email) => {
            totalClicks += email.clicks.reduce((sum, clicks) => sum + clicks, 0);
        });

        const ctr = (totalClicks / totalEmailsSent) * 100;
        res.status(200).json({ ctr: ctr.toFixed(2) + '%' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to calculate CTR.' });
    }
};



module.exports = { handleGenerateTrackingURL, handleEmailTracking, handleLogClick, handleGetClickCount, handleGetCTR };

