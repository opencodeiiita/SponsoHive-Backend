const request = require('supertest');
const app = require('../server'); // Your main app file
const path = require('path');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Test suite for Email Upload and Validation
describe('Email Upload and Validation', () => {
  // Set up in-memory MongoDB before all tests
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  // Clear any leftover data after each test
  afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  // Disconnect mongoose and stop the in-memory server after all tests
  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  // Actual test case
  it('should validate uploaded emails successfully', async () => {
    const response = await request(app)
      .post('/api/email/upload') // Replace with your actual endpoint
      .attach('file', path.resolve(__dirname, './mock/emails.csv'));

    expect(response.statusCode).toBe(200);
    expect(response.body.validEmails).toContain('test1@example.com');
    expect(response.body.invalidEmails).toContain('invalid-email');
  });
});
