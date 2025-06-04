const EmailTemplate = require("../models/emailTemplateUser");
const handlebars = require('handlebars'); // adjust path if needed

//* Create a new email template for a project
exports.createTemplate = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, subject, body } = req.body;
    // Check for existing template with the same name and project
    const existingTemplate = await EmailTemplate.findOne({ name, projectId });
    if (existingTemplate) {
      return res.status(400).json({
        message: "Template with this name already exists for this project",
      });
    }
    //  Optional: validate the body by compiling it
    try {
      handlebars.compile(body); // throws if invalid
    } catch (err) {
      return res.status(400).json({
        message: "Invalid template syntax in 'body'",
        error: err.message,
      });
    }
    // Save the template
    const newTemplate = new EmailTemplate({
      projectId,
      name,
      subject,
      body,
    });
    await newTemplate.save();
    res.status(201).json(newTemplate);
  } catch (error) {
    res.status(400).json({
      message: "Error creating email template",
      error: error.message,
    });
  }
};

//* Get all email templates for a specific project
exports.getAllTemplates = async (req, res) => {
  try {
    const { projectId } = req.params;
    const templates = await EmailTemplate.find({ projectId }).populate(
      "projectId",
      "name"
    );
    if (!templates || templates.length === 0) {
      return res.status(404).json({ message: "No email templates found for this project" });
    }
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({
        message: "Error retrieving email templates",
        error: error.message,
      });
  }
};

//* Get a single email template by ID
exports.getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await EmailTemplate.findById(id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    res.status(200).json(template);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving email template",
        error: error.message,
      });
  }
};

//* Update an existing email template by ID
exports.updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, body } = req.body;

    const template = await EmailTemplate.findByIdAndUpdate(
      id,
      { name, subject, body, updatedAt: Date.now() },
      { new: true }
    );

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json(template);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating email template", error: error.message });
  }
};

//* Soft Delete EmailTemplate
exports.deleteTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findOne({ _id: req.params.id, status: 1 });
    if (!template) {
      return res.status(404).json({ message: "EmailTemplate not found or already deleted" });
    }

    template.status = 5; // Soft-delete
    await template.save();

    res.status(200).json({ message: "EmailTemplate soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete EmailTemplate",
      error: error.message
    });
  }
};

//* Restore deleted template
exports.restoreEmailTemplate = async (req, res) => {
  try {
    const template = await EmailTemplate.findOne({ _id: req.params.id, status: 5 });
    if (!template) {
      return res.status(404).json({ message: "EmailTemplate not found or not deleted" });
    }

    template.status = 1; // Restore
    await template.save();

    res.status(200).json({ message: "EmailTemplate restored successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error restoring EmailTemplate",
      error: error.message
    });
  }
};

