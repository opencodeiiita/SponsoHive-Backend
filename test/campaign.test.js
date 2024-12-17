// const { MongoMemoryServer } = require('mongodb-memory-server');
// const mongoose = require('mongoose');
// const { Campaign, scheduleCampaign } = require('../routes/campaignRoutes');

// let mongoServer;

// beforeAll(async () => {
//   mongoServer = await MongoMemoryServer.create();
//   await mongoose.connect(mongoServer.getUri());
// });

// afterAll(async () => {
//   await mongoose.disconnect();
//   await mongoServer.stop();
// });

// describe('Campaign Scheduling Logic', () => {
//   test('schedules main email and follow-ups', async () => {
//     const campaign = await Campaign.create({
//       name: 'Test Campaign',
//       recipients: ['test@example.com'],
//       scheduleTime: new Date(Date.now() + 1000), // 1 second later
//       followUpSequence: [{ delayInHours: 1 }, { delayInHours: 2 }],
//     });

//     await scheduleCampaign(campaign._id);
//     await new Promise((r) => setTimeout(r, 1500)); // Simulate scheduled time

//     const updated = await Campaign.findById(campaign._id);
//     expect(updated.status).toBe('sent');
//   });
// });
