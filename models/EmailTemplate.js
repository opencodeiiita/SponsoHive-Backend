const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  placeholders: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Template = mongoose.model('Template', templateSchema);
module.exports = Template;
