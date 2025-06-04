const express = require("express");
const router = express.Router();
const formSubmissionController = require("../controllers/formSubmissionController");
const projectAuth = require('../middlewares/projectAuth.js');
let  validAuth = require('../middlewares/authValid');
const multer = require('multer');
const upload = multer(); // memory storage, files available in req.files


// Apply authentication to all routes
router.use(projectAuth);
//router.use(validAuth);
// Submit form
router.post('/submit', upload.array('attachments'), formSubmissionController.submitForm);
//router.post("/submit", formSubmissionController.submitForm);

// List submissions (with optional filters)
router.get("/form-submissions", formSubmissionController.getSubmissions);

// Get one submission by ID
router.get("/form-submissions/:id", formSubmissionController.getSubmissionById);

// Submit form data (public) — no need for auth in case of public forms
//router.post("/submit", formSubmissionController.submitForm);

// Update a submission
router.put("/form-submissions/:id", formSubmissionController.updateSubmission);

// Delete a submission
router.delete("/form-submissions/:id", formSubmissionController.deleteSubmission);

// Restore a soft-deleted submission
router.patch("/form-submissions/:id/restore", formSubmissionController.restoreSubmission);

module.exports = router;
