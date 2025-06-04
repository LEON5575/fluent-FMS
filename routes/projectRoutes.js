const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middlewares/auth');

// All routes are protected with auth middleware
router.use(auth);

// Get all projects
router.get('/', projectController.getProjects);

// Get single project
router.get('/:id', projectController.getProject);

// Get projects by client
router.get('/client/:clientId', projectController.getClientProjects);

// Create new project
router.post('/', projectController.createProject);

// Update project
router.put('/:id', projectController.updateProject);

// Soft delete project
router.delete('/:id', projectController.deleteProject);

// Restore deleted project
router.post('/:id/restore', projectController.restoreProject);

module.exports = router; 