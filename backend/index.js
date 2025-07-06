const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
const TaskRouter = require('./Routes/TaskRouter');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

app.get('/ping', (req, res) => res.send('PONG'));

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', AuthRouter);
app.use('/tasks', TaskRouter);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
