const express = require('express');
const router = express.Router();
const smtpController = require('../controllers/smtpConfigController');

//! Create a new SMTP config
router.post('/', smtpController.createConfig);

//! Get all SMTP configs
router.get('/', smtpController.getAllConfigs);

//! Get a specific SMTP config by ID
router.get('/:id', smtpController.getConfigById);

//! Update an SMTP config
router.put('/:id', smtpController.updateConfig);

//! Soft delete
router.delete('/:id', smtpController.deleteConfig);

//! Restore a deleted SMTP config
router.patch('/:id/restore', smtpController.restoreConfig);

module.exports = router;
