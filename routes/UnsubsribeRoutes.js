const express = require('express');
const Recipient = require('../models/RecepientModel');
const updateBounce = require('../utils/bounceMonitor');
const router = express.Router();

router.get('/', async (req, res) => {

  const { email } = req.query;

  if (!email) {
    return res.status(400).send('Email parameter is required');
  }

  try {
    await Recipient.updateOne(
      { email },
      { $set: { status: 'Unsubscribed', updatedAt: new Date() } }
    );
    res.send('You have been unsubscribed successfully.');
  } catch (error) {
    console.error(`Failed to process unsubscribe for ${email}:`, error.message);
    res.status(500).send('Failed to unsubscribe. Please try again later.');
  }

});

router.get('/stats', async (req, res)=>{

    try {
        await updateBounce();
        const counts = await Recipient.getStatusCounts();
        res.json({ counts });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve status counts' });
    }

})

module.exports = router;
