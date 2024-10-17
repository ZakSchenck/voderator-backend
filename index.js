
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js');
const cors = require('cors');
const favicon = require('serve-favicon');
const serverless = require('serverless-http');

dotenv.config();

app.use(express.json());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Welcome to the Express JWT Auth API!');
});

app.use('/api/v1', userRoutes);

module.exports = serverless(app);

