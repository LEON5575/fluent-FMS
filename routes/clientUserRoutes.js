


const express = require('express');
const router = express.Router();
const clientUserController = require('../controllers/clientUserController');
const auth = require('../middlewares/auth');
let  validAuth = require('../middlewares/authValid');
// Protect all routes with auth middleware
router.use(auth);
router.use(validAuth);
// Create new client user
router.post('/', clientUserController.createClientUser);

// Get all client users
router.get('/', clientUserController.getClientUsers);

// Get single client user by id
router.get('/:id', clientUserController.getClientUser);

// Update client user by id
router.put('/:id', clientUserController.updateClientUser);

// Soft delete client user by id
router.delete('/:id', clientUserController.deleteClientUser);

// Restore soft deleted client user
router.post('/:id/restore', clientUserController.restoreClientUser);

router.post('/login', clientUserController.loginClientUser);

// @route   POST /api/client-auth/logout
// @desc    Logout client user
router.post('/logout', clientUserController.logoutClientUser);

// @route   GET /api/client-auth/profile
// @desc    Get logged-in client user profile
// @access  Protected (requires valid token and middleware)
router.get('/profile', clientUserController.getClientUserProfile);
router.get('/by-client/:clientId', clientUserController.getClientUsersByClientId);
router.get('/by-project/:projectId', clientUserController.getClientUsersByProjectId);

module.exports = router;
