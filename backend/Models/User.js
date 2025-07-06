const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { type: String, required: true },
    status: { type: String, default: 'pending' },
    dueDate: { type: Date }
});

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tasks: [taskSchema]
});

const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel;