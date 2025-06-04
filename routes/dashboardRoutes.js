const express = require('express');
const router = express.Router();
const clientDashBoardController = require('../controllers/DashBoardController');
const auth = require('../middlewares/auth'); // Optional if you need auth

// Optionally protect the routes
router.use(auth);

// GET /dashboard/:clientId/projects
router.get('/:clientId/projects', clientDashBoardController.getProjects);

// GET /dashboard/:clientId/forms
router.get('/:clientId/forms', clientDashBoardController.getForms);

// GET /dashboard/:clientId/submissions
router.get('/:clientId/submissions', clientDashBoardController.getSubmissions);

//get overview of clients
router.get('/:clientId/overview', clientDashBoardController.getOverview);

module.exports = router;
