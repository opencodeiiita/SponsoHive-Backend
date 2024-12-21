const mongoose = require('mongoose');
const axios = require('axios');
const Campaign = require('./models/Campaign');
const EmailList = require('./models/EmailList');
const User = require('./models/User');


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

    console.log('Mock data setup complete');
    return emailList;
  } catch (error) {
    console.error('Error setting up mock data:', error);
    process.exit(1);
  }
}

async function createAndScheduleCampaign(emailListId) {
  try {
    // Send POST request to create the campaign and schedule it
    const response = await axios.post(API_URL, {
      name: 'Test Campaign',
      emailListId: emailListId,
      schedule: new Date(Date.now() + 60 * 1000), // 1 minute from now
    });

    console.log('Campaign created and scheduled:', response.data);
    return response.data; 

  } catch (error) {
    console.error('Error creating or scheduling campaign:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function testEmailScheduler() {

  await connectToDB();
  const emailList = await setupMockData();

  const campaign = await createAndScheduleCampaign(emailList._id);
  console.log('Waiting for the campaign to execute...');

  setTimeout(async () => {
    console.log("Check the mail for testing");
    await mongoose.connection.close();
    console.log('Test complete and database connection closed.');
  }, 150 * 1000); // Wait 2 minutes to ensure campaign execution
}

testEmailScheduler();
