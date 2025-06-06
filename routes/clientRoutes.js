const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const auth = require('../middlewares/auth');

// All routes are protected with auth middleware
router.use(auth);

// Get all clients
router.get('/', clientController.getClients);

// Get single client
router.get('/:id', clientController.getClient);

// Create new client
router.post('/', clientController.createClient);

// Update client
router.put('/:id', clientController.updateClient);

// Soft delete client
router.delete('/:id', clientController.deleteClient);

// Restore deleted client
router.post('/:id/restore', clientController.restoreClient);

module.exports = router; 