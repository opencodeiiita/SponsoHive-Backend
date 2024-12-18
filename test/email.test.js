const request = require('supertest');
const app = require('../server'); 
const path = require('path');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

describe('Email Upload and Validation', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should validate uploaded emails successfully', async () => {
    const response = await request(app)
      .post('/api/email/upload') 
      .attach('file', path.resolve(__dirname, './mock/emails.csv'));

    expect(response.statusCode).toBe(200);
    expect(response.body.validEmails).toContain('test1@example.com');
    expect(response.body.invalidEmails).toContain('invalid-email');
  });
});
