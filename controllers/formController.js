const FORM = require('../models/Form.js');
const Project = require('../models/Project.js');
const SMTPConfig = require('../models/smtpConfig');
const nodemailer = require('nodemailer');

//?create form
exports.createForm = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Step 1: Validate project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    if (!project.active) {
      return res.status(400).json({ message: "Cannot create form: associated project is not active" });
    }

    // Step 2: Ensure 'active' is true
    if (req.body.active !== true) {
      return res.status(400).json({ message: "Cannot create form: 'active' must be true" });
    }

    // Step 3: Create form
    const formData = {
      ...req.body,
      projectId
    };
    const form = await FORM.create(formData);

    // Step 4: Fetch linked SMTP config
    const smtp = await SMTPConfig.findById(form.linkedSmtpId);
    if (!smtp || smtp.status !== 1) {
      return res.status(201).json({ 
        form,
        warning: "Form created, but email was not sent (SMTP config invalid or inactive)" 
      });
    }

    // Step 5: Create transporter and send email
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.authUser,
        pass: smtp.authPass
      }
    });

    await transporter.sendMail({
      from: smtp.fromEmail || smtp.authUser,
      to: "dusmanta.n@nipralo.com", // Change or make dynamic if needed
      subject: `Form Created: ${form.name}`,
      html: `<p>A new form <strong>${form.name}</strong> was created under project <strong>${project.name}</strong>.</p>`
    });

    res.status(201).json({ form, message: "Form created and email sent" });

  } catch (error) {
    console.error("Create form error:", error);
    res.status(500).json({
      message: "Failed to create form",
      error: error.message
    });
  }
};

//? get all forms
exports.getAllForms = async (req, res) => {
  try {
    const { projectId } = req.params;  // Extract projectId from URL params
    // Find active forms associated with the project
    const forms = await FORM.find({ projectId, status: 1 })
      .populate('projectId', 'name')  // Populate projectId with 'name'
      .populate('linkedSmtpId', 'name host port')  // Populate SMTP info
      .populate('adminTemplateId', 'name subject body')  // Populate admin template
      .populate('userTemplateId', 'name subject body')  // Populate user template
      .sort({ createdAt: -1 });  // Sort forms by createdAt in descending order
    // If no forms are found, return a message
    if (!forms || forms.length === 0) {
      return res.json({ message: "No active forms found for this project" });
    }
    // Respond with the forms data
    res.json(forms);
  } catch (error) {
    // Log the error to the console for debugging
    console.error("Error in getAllForms:", error);
    // Return error response with the error message
    res.json({
      message: "Error retrieving forms",
      error: error.message
    });
  }
};

//? Get a single form by ID with populated refs
exports.getFormById = async (req, res) => {
  try {
    const form = await FORM.findById(req.params.id)
      .populate('linkedSmtpId', 'name host port')  // adjust SMTP fields as needed
      .populate('adminTemplateId', 'name subject body')
      .populate('userTemplateId', 'name subject body');

    if (!form) {
      return res.json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    res.json({ message: "Error retrieving form", error: error.message });
  }
};

//? Update a form by ID
exports.updateForm = async (req, res) => {
  try {
    const form = await FORM.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    res.json({ message: "Error updating form", error: error.message });
  }
};

//? Soft delete a form by ID (set status to 5)
exports.deleteForm = async (req, res) => {
  try {
    const form = await FORM.findOne({ _id: req.params.id, status: 1 });
    if (!form) {
      return res.json({ message: "Form not found or already deleted" });
    }
    form.status = 5;
    await form.save();
    res.json({ message: "Form soft-deleted successfully" });
  } catch (error) {
    res.json({ message: "Failed to delete form", error: error.message });
  }
};

//? Restore a soft-deleted form by ID (set status back to 1)
exports.restoreForm = async (req, res) => {
  try {
    const form = await FORM.findOne({ _id: req.params.id, status: 5 });
    if (!form) {
      return res.json({ message: "Form not found or not deleted" });
    }
    form.status = 1;
    await form.save();
    res.json({ message: "Form restored successfully" });
  } catch (error) {
    res.json({ message: "Error restoring form", error: error.message });
  }
};







//  exports.createForm = async (req, res) => {
//   try {
//     const { projectId } = req.params;
//     // Step 1: Validate project
//     const project = await Project.findById(projectId);
//     if (!project) {
//       return res.json({ message: "Project not found" });
//     }
//     if (!project.active) {
//       return res.json({ message: "Cannot create form: associated project is not active" });
//     }
//     // Step 2: Ensure form is being created as active
//     if (req.body.active !== true) {
//       return res.json({ message: "Cannot create form: 'active' must be true" });
//     }
//     // Step 3: Create form
//     const formData = {
//       ...req.body,
//       projectId
//     };
//     const form = await FORM.create(formData);
//     res.json(form);
//   } catch (error) {
//     res.json({
//       message: "Failed to create form",
//       error: error.message
//     });
//   }
// };