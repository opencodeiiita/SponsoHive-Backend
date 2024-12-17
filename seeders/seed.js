const mongoose = require('mongoose');
const User = require('./models/User');
const EmailList = require('./models/EmailList');
const Contact = require('./models/Contact');
const Campaign = require('./models/Campaign');
const Template = require('./models/Template');

const seedData = async () => {
  await mongoose.connect('mongodb://localhost:27017/EmailMarketingDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Create Users
  const users = await User.insertMany([
    { name: 'Arjun', email: 'arjun@example.com', hashedPassword: 'hashedpassword1', role: 'Admin' },
    { name: 'Maharaja', email: 'maharaja@example.com', hashedPassword: 'hashedpassword2', role: 'Team Member' },
    { name: 'TeamMember1', email: 'teammember1@example.com', hashedPassword: 'hashedpassword3', role: 'Team Member' }
  ]);

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

  // Create Templates
  const templates = await Template.insertMany([
    { title: 'Welcome Email', content: 'Hello {name}, welcome to our service!', placeholders: '{name}' },
    { title: 'Thank You Email', content: 'Thank you for subscribing, {name}.', placeholders: '{name}' }
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
