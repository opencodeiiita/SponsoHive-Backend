const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongo;

module.exports.connect = async () => {
  if (!mongo) {
    mongo = await MongoMemoryServer.create();
  }

  const uri = mongo.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports.disconnect = async () => {
  if (mongoose.connection.readyState) {
    const collections = mongoose.connection.collections;
    for (let key in collections) {
      await collections[key].deleteMany({});
    }
    await mongoose.connection.close();
  }
  if (mongo) {
    await mongo.stop();
    mongo = null;
  }
};
