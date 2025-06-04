const FormSubmission = require("../models/formSubmission");
const Form = require("../models/Form");
const { uploadBufferToCloudinary, generateSignedUrl } = require("../utils/cloudinary");
require("dotenv").config();

//&create submit form
exports.submitForm = async (req, res) => {
  try {
    const { formId, submissionData: submissionDataRaw, clientId: clientIdFromBody } = req.body;

    if (!formId || !submissionDataRaw) {
      return res.json({ message: "formId and submissionData are required" });
    }

    let submissionData;
    try {
      submissionData = JSON.parse(submissionDataRaw);
    } catch (parseError) {
      return res.json({ message: "Invalid JSON in submissionData" });
    }

    if (!req.project || !req.project._id || !req.project.clientId) {
      return res.json({ message: "Invalid or missing project token" });
    }

    const clientId = clientIdFromBody || req.project.clientId;

    const form = await Form.findById(formId).lean();
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const formProjectId = form.projectId?._id?.toString?.() || form.projectId?.toString?.() || String(form.projectId);
    const tokenProjectId = req.project._id.toString();

    console.log("Form Project ID:", formProjectId);
    console.log("Token Project ID:", tokenProjectId);

    if (formProjectId !== tokenProjectId) {
      return res.json({
        message: "Invalid token: This project is not authorized to submit this form"
      });
    }

    // Optional clientId check
    // if (form.clientId.toString() !== clientId.toString()) {
    //   return res.status(403).json({ message: "Client ID mismatch" });
    // }

    const uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const filename = `upload-${Date.now()}`;
          const uploaded = await uploadBufferToCloudinary(file.buffer, filename);
          const signedUrl = generateSignedUrl(uploaded.public_id);
          uploadedFiles.push(signedUrl);
        } catch (uploadErr) {
          console.error("File upload error:", uploadErr);
          return res.json({ message: "File upload failed", error: uploadErr.message });
        }
      }
    }

    if (!submissionData.attachments) submissionData.attachments = [];
    submissionData.attachments = submissionData.attachments.concat(uploadedFiles);

    const newSubmission = await FormSubmission.create({
      formId,
      clientId,
      projectId: req.project._id,
      submissionData
    });

    res.json(newSubmission);

  } catch (err) {
    console.error("Error submitting form:", err);
    res.json({
      message: "Error submitting form",
      error: err.message
    });
  }
};


//& List submissions with filters
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
    res.json({ message: "Error fetching submissions", error: err.message });
  }
};

//& Get a single submission
exports.getSubmissionById = async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id);
    if (!submission) {
      return res.json({ message: "Submission not found" });
    }
    res.json(submission);
  } catch (err) {
    res.json({ message: "Error fetching submission", error: err.message });
  }
};

//& update a submission
exports.updateSubmission = async (req, res) => {
  try {
    const { submissionData, attachments } = req.body; // this comes from the form data

    // If the submission data is invalid or not present
    if (!submissionData) {
      return res.json({ message: "Submission data is required" });
    }

    const submission = await FormSubmission.findById(req.params.id);
    
    if (!submission) {
      return res.json({ message: "Submission not found" });
    }

    // Update the submission data and attachments
    submission.submissionData = submissionData || submission.submissionData;
    submission.attachments = attachments || submission.attachments;

    await submission.save();
    res.json(submission);
  } catch (err) {
    res.json({ message: "Error updating submission", error: err.message });
  }
};

//& Delete a submission soft delete
exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await FormSubmission.findOne({ _id: req.params.id, status: 1 });
    if (!submission) {
      return res.json({ message: "Submission not found or already deleted" });
    }
    submission.status = 5; // Soft delete
    await submission.save();
    res.json({ message: "Submission-Form soft-deleted successfully" });
  } catch (err) {
    res.json({ message: "Error deleting submission", error: err.message });
  }
};

//& Restore a soft-deleted submission    
exports.restoreSubmission = async (req, res) => {
  try {
    const submission = await FormSubmission.findOne({ _id: req.params.id, status: 5 });
    if (!submission) {
      return res.json({ message: "Submission not found or not deleted" });
    }
    submission.status = 1; // Restore
    await submission.save();
    res.json({ message: "Submission restored successfully" });
  } catch (err) {
    res.json({ message: "Error restoring submission", error: err.message });
  }
};
