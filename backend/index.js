const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const TaskRouter = require('./Routes/TaskRouter');

require('dotenv').config();
require('./Models/db');

const User = require('./Models/User'); 

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', AuthRouter);
app.use('/tasks', TaskRouter);

app.get('/ping', (req, res) => res.send('PONG'));


app.get('/tasks/view', async (req, res) => {
  try {
    const tasks = await User.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', async (req, res) => {
  try {
    const users = await User.find().select('email tasks -_id');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(users, null, 2)); 
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT} 🚀`));
