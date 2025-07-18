const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const User = require('../Models/User');

// ✅ GET tasks for the logged-in user
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Add a new task
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.tasks.push({ title, dueDate });
    await user.save();

    res.json({ success: true, message: 'Task added', tasks: user.tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// ✅ Update task by ID
router.put('/:taskId', ensureAuthenticated, async (req, res) => {
  try {
    const { title, status, dueDate } = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const task = user.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined) task.title = title;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await user.save();
    res.json({ success: true, message: 'Task updated', task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ✅ Delete task by ID
router.delete('/:taskId', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const task = user.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    user.tasks.pull({ _id: req.params.taskId });
    await user.save();

    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
