const express = require('express');
const router = express.Router();
const emailTemplateAdminController = require('../controllers/emailTemplateAdminController');
const auth = require('../middlewares/auth');
let  validAuth = require('../middlewares/authValid');

// All routes are protected with auth middleware
router.use(auth);
router.use(validAuth);
// Create a new email template for a project
router.post('/projects/:projectId/email-templates', emailTemplateAdminController.createTemplate);

// Get all email templates for a specific project
router.get('/projects/:projectId/email-templates', emailTemplateAdminController.getAllTemplates);

// Get a single email template by ID
router.get('/:id', emailTemplateAdminController.getTemplateById);

// Update an existing email template by ID
router.put('/:id', emailTemplateAdminController.updateTemplate);

// Delete an email template by ID
router.delete('/:id', emailTemplateAdminController.deleteTemplate);

// Restore a deleted SMTP config
router.patch("/:id/restore", emailTemplateAdminController.restoreEmailTemplate);

module.exports = router;
