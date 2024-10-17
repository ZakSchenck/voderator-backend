
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const userRoutes = require('../routes/userRoutes.js');
const cors = require('cors');

dotenv.config();

app.use(express.json());

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

module.exports = app;
