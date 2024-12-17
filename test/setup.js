const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Avoid multiple connections
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

afterEach(async () => {
  // Clear all collections after each test
  const collections = mongoose.connection.collections;
  for (let collection in collections) {
    await collections[collection].deleteMany({});
  }
});

afterAll(async () => {
  // Disconnect and stop MongoMemoryServer
  await mongoose.disconnect();
  await mongoServer.stop();
});
