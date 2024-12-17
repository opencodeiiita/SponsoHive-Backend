const User = require('./models/User');
const EmailList = require('./models/EmailList');
const Contact = require('./models/Contact');
const Campaign = require('./models/Campaign');
const Template = require('./models/Template');
const { connectDB } = require('../config/db');

const seedData = async () => {
  await connectDB();


  // Create Email Lists
  const emailLists = await EmailList.insertMany([
    { name: 'Customers List', tags: 'VIP, Monthly' },
    { name: 'Leads List', tags: 'Sales, High Priority' }
  ]);

  // Create Contacts
  const contacts = await Contact.insertMany([
    { email: 'john.doe@example.com', name: 'John Doe', emailListId: emailLists[0]._id },
    { email: 'jane.smith@example.com', name: 'Jane Smith', emailListId: emailLists[0]._id },
    { email: 'alice.jones@example.com', name: 'Alice Jones', emailListId: emailLists[1]._id }
  ]);


  // Create Campaigns
  const campaigns = await Campaign.insertMany([
    { name: 'Weekly Newsletter', emailListId: emailLists[0]._id, schedule: new Date('2024-12-20T09:00:00'), status: 'Scheduled' },
    { name: 'Holiday Sale', emailListId: emailLists[1]._id, schedule: new Date('2024-12-25T10:00:00'), status: 'Scheduled' }
  ]);

  console.log('Seed data inserted successfully!');
  mongoose.connection.close();
};

seedData();
