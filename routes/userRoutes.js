const express = require('express');
const { getUsers, addVodToCatalogue, loginUser, getUserByUsername } = require('../controllers/userController');
const { createUser } = require('../controllers/userController');

const router = express.Router();

router.get('/users', getUsers); 
router.post('/users/signup', createUser);
router.post('/users/login', loginUser);
router.put('/users/catalogue', addVodToCatalogue);
router.get('/users/:username', getUserByUsername);

module.exports = router;