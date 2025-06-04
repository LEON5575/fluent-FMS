const FormSubmission = require("../models/formSubmission");

// List submissions with filters
exports.getSubmissions = async (req, res) => {
  try {
    const { clientId, projectId, formId, startDate, endDate, keyword } = req.query;
    const filter = {};
    if (clientId) filter.clientId = clientId;
    if (projectId) filter.projectId = projectId;
    if (formId) filter.formId = formId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    if (keyword) {
      filter["submissionData"] = {
        $regex: keyword,
        $options: "i"
      };
    }
    const submissions = await FormSubmission.find(filter).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching submissions", error: err.message });
  }
};

// Get a single submission
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: "Error fetching submission", error: err.message });
  }
};

// Submit form data (public)
exports.submitForm = async (req, res) => {
  try {
    const { formId, submissionData, attachments } = req.body;

    if (!formId || !submissionData) {
      return res.status(400).json({ message: "formId and submissionData are required" });
    }

    const newSubmission = await FormSubmission.create({
      formId,
      submissionData,
      attachments
    });

    res.status(201).json(newSubmission);
  } catch (err) {
    res.status(500).json({ message: "Error submitting form", error: err.message });
  }
};

//update a submission
exports.updateSubmission = async (req, res) => {
  try {
    const { submissionData, attachments } = req.body;
    const submission = await FormSubmission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.submissionData = submissionData || submission.submissionData;
    submission.attachments = attachments || submission.attachments;

    await submission.save();
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: "Error updating submission", error: err.message });
  }
};


// Delete a submission soft delete
exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await FormSubmission.findOne({ _id: req.params.id, status: 1 });
    if (!submission) {
      return res.status(404).json({ message: "Submission not found or already deleted" });
    }
    submission.status = 5; // Soft delete
    await submission.save();
    res.json({ message: "Submission-Form soft-deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting submission", error: err.message });
  }
};

// Restore a soft-deleted submission    
exports.restoreSubmission = async (req, res) => {
  try {
    const submission = await FormSubmission.findOne({ _id: req.params.id, status: 5 });
    if (!submission) {
      return res.status(404).json({ message: "Submission not found or not deleted" });
    }
    submission.status = 1; // Restore
    await submission.save();
    res.json({ message: "Submission restored successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error restoring submission", error: err.message });
  }
};

// Delete a submission hard delete
// exports.deleteSubmission = async (req, res) => {
//   try {
//     const deleted = await FormSubmission.findByIdAndDelete(req.params.id);
//     if (!deleted) {
//       return res.status(404).json({ message: "Submission not found" });
//     }
//     res.json({ message: "Submission deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting submission", error: err.message });
//   }
// };

