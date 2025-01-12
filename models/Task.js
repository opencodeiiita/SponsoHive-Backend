const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  dueDate: Date,
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, default: 'Pending' }, // 'Pending', 'Completed'
  priority: { type: String, default: 'Medium' }, // 'Low', 'Medium', 'High'
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);
