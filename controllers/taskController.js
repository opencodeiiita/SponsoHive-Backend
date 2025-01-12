const Task = require('../models/Task');
const User = require('../models/User');

// Utility function for async error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a new task
exports.createTask = asyncHandler(async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).json({ message: 'Task created successfully', task });
});

// Edit an existing task
exports.editTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json({ message: 'Task updated successfully', task });
});

// Delete a task
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(200).json({ message: 'Task deleted successfully' });
});

// Assign a task to users
exports.assignTask = asyncHandler(async (req, res) => {
  const { userIds } = req.body;

  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const validUsers = await User.find({ _id: { $in: userIds } });
  if (validUsers.length !== userIds.length) {
    return res.status(400).json({ error: 'One or more User IDs are invalid' });
  }

  task.assignedTo = userIds;
  await task.save();

  res.status(200).json({
    message: 'Task assigned successfully',
    task,
  });
});
