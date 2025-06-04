const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middlewares/auth');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user (protected route)
router.get('/me', auth, authController.getCurrentUser);

module.exports = router;
