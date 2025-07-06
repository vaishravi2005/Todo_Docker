const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const User = require('../Models/User');

router.get('/', ensureAuthenticated, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    res.json(user.tasks);
});

router.post('/', ensureAuthenticated, async (req, res) => {
    const { title, dueDate } = req.body;
    const user = await User.findOne({ email: req.user.email });
    user.tasks.push({ title, dueDate });
    await user.save();
    res.json({ success: true, message: 'Task added', tasks: user.tasks });
});

router.put('/:taskId', ensureAuthenticated, async (req, res) => {
    const { title, status, dueDate } = req.body;
    const user = await User.findOne({ email: req.user.email });
    const task = user.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (title !== undefined) task.title = title;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await user.save();
    res.json({ success: true, message: 'Task updated', task });
});

router.delete('/:taskId', ensureAuthenticated, async (req, res) => {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const task = user.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    user.tasks.pull({ _id: req.params.taskId });
    await user.save();

    res.json({ success: true, message: 'Task deleted' });
});

module.exports = router;