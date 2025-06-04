const express = require("express");
const router = express.Router();
const formSubmissionController = require("../controllers/formSubmissionController");

// List submissions (with optional filters)
router.get("/form-submissions", formSubmissionController.getSubmissions);

// Get one submission by ID
router.get("/form-submissions/:id", formSubmissionController.getSubmissionById);

// Submit form data (public)
router.post("/submit", formSubmissionController.submitForm);

//update a submission
router.put("/form-submissions/:id", formSubmissionController.updateSubmission);

// Delete a submission
router.delete("/form-submissions/:id", formSubmissionController.deleteSubmission);

// Restore a soft-deleted submission
router.patch("/form-submissions/:id/restore", formSubmissionController.restoreSubmission);

module.exports = router;
