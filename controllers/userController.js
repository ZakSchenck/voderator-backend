const pool = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// GET all users
const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to get Users');
    }
};

// POST new user
const createUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExists.rows.length > 0) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const result = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

// POST Login user and emit JWT
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


// UPDATE an item to the user's VOD array catalogue
const addVodToCatalogue = async (req, res) => {
    const { username } = req.body; 
    const { vodObject } = req.body;  

    try {
        // append to add a new vod to the obj field
        const result = await pool.query(
            'UPDATE users SET vods = vods || $1::jsonb WHERE username = $2 RETURNING vods;',
            [vodObject, username]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'VOD added to array successfully',
            updatedArray: result.rows[0].vods
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

getUserByUsername = async (req, res) => {
    const { username } = req.params; 

    try {
        const result = await pool.query('SELECT id, username, vods FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0]; 

        res.status(200).json({
            id: user.id,
            username: user.username,
            vods: user.vods
        });
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = {
    getUsers,
    createUser,
    addVodToCatalogue,
    loginUser,
    getUserByUsername
};