const express = require('express');
const router = express.Router();
const emailTemplateUserController = require('../controllers/emailTemplateUserController');
const auth = require('../middlewares/auth');
let  validAuth = require('../middlewares/authValid');

// All routes are protected with auth middleware
router.use(auth);
router.use(validAuth);
// Create a new email template for a project
router.post('/projects/:projectId/email-templates', emailTemplateUserController.createTemplate);

// Get all email templates for a specific project
router.get('/projects/:projectId/email-templates', emailTemplateUserController.getAllTemplates);

// Get a single email template by ID
router.get('/:id', emailTemplateUserController.getTemplateById);

// Update an existing email template by ID
router.put('/:id', emailTemplateUserController.updateTemplate);

// Delete an email template by ID
router.delete('/:id', emailTemplateUserController.deleteTemplate);

// Restore a deleted SMTP config
router.patch("/:id/restore", emailTemplateUserController.restoreEmailTemplate);

module.exports = router;
