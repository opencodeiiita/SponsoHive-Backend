const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createTask, editTask, deleteTask, assignTask } = require('../controllers/taskController');
const validate = require('../middleware/validate');

// Create Task
router.post(
  '/',
  validate([
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ]),
  createTask
);

// Edit Task
router.put(
  '/:id',
  validate([
    body('title').optional().isString(),
    body('description').optional().isString(),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
  ]),
  editTask
);

// Delete Task
router.delete('/:id', deleteTask);

// Assign Task
router.post(
  '/:id/assign',
  validate([
    body('userIds').isArray({ min: 1 }).withMessage('User IDs must be an array with at least one ID'),
    body('userIds.*').isMongoId().withMessage('Invalid User ID'),
  ]),
  assignTask
);

module.exports = router;
