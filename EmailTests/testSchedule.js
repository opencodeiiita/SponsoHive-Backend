const mongoose = require('mongoose');
const { scheduleCampaign } = require('./utils/schedulerService');
const Campaign = require('./models/Campaign');
const EmailList = require('./models/EmailList');
const User = require('./models/User');

// Mock data setup
async function setupMockData() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await EmailList.deleteMany({});
    await Campaign.deleteMany({});

    // Create a mock user
    const user = new User({ name: 'Test User', email: 'test@example.com', password: 'password123' });
    await user.save();

    // Create a mock email list
    const emailList = new EmailList({
      name: 'Test Email List',
      tags: ['test', 'mock'],
      userId: user._id,
      emails: ['EMAIL_ID_1@gmail.com', 'EMAIL_ID_2@iiita.ac.in'], // Add mock email addresses here
    });
    await emailList.save();

    // Create a mock campaign scheduled 1 minute from now
    const campaign = new Campaign({
      name: 'Test Campaign',
      emailListId: emailList._id,
      schedule: new Date(Date.now() + 60 * 1000), // 1 minute from now
    });
    await campaign.save();

    console.log('Mock data setup complete');
    return campaign;

  } catch (error) {
    console.error('Error setting up mock data:', error);
    process.exit(1);
  }
}

// Main function to test email scheduling
async function testEmailScheduler() {
  await connectToDB();

  const campaign = await setupMockData();

  // Schedule the campaign
  scheduleCampaign(campaign);

  console.log('Waiting for the campaign to execute...');

  setTimeout(async () => {
    const updatedCampaign = await Campaign.findById(campaign._id);
    console.log('Campaign status after execution:', updatedCampaign.status);
    await mongoose.connection.close();
    console.log('Test complete and database connection closed.');
  }, 2 * 60 * 1000);
}

// Run the test
testEmailScheduler();
