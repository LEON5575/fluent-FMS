const express = require("express");
const router = express.Router();
const smtpController = require("../controllers/smtpConfigController");
const auth = require('../middlewares/auth');
let  validAuth = require('../middlewares/authValid');

// All routes are protected with auth middleware
router.use(auth);
router.use(validAuth);
//! Create a new SMTP config for a project
router.post("/projects/:projectId/smtp-configs", smtpController.createConfig);

//! Get all SMTP configs for a project
router.get("/projects/:projectId/smtp-configs", smtpController.getAllConfigs);

//! Get a specific SMTP config by ID
router.get("/:id", smtpController.getConfigById);

//! Update an SMTP config
router.put("/:id", smtpController.updateConfig);

//! Soft delete
router.delete("/:id", smtpController.deleteConfig);

//! send test email
router.post("/:smtpId/send-email", smtpController.sendMail);

//! Restore a deleted SMTP config
router.patch("/:id/restore", smtpController.restoreConfig);

module.exports = router;
