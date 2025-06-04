const FORM = require('../models/form.js');

//? Create a new form from the project ID
exports.createForm = async (req, res) => {
  try {
    const { projectId } = req.params;
    const formData = {
      ...req.body,
      projectId
    };
    const form = await FORM.create(formData);
    res.json(form);
  } catch (error) {
    res.json({
      message: "Failed to create  form",
      error: error.message
    });
  }
};

//? Get all forms for a project
exports.getAllForms = async (req, res) => {
  try {
    const { projectId } = req.params;
    const forms = await FORM.find({ projectId });
    res.json(forms);
}catch (error) {
    res.json({
      message: "Error retrieving forms",
      error: error.message
    }); }
}

//? Get a form by ID
exports.getFormById = async (req, res) => {
  try {
    const form = await FORM.findById(req.params.id);
    if (!form)
      return res.json({ message: "Form not found" });
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
    if (!form)
      return res.json({ message: "Form not found" });
    res.json(form);
  } catch (error) {
    res.json({ message: "Error updating form", error: error.message });
  }
};

//? soft delete a form by ID
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

//? Restore a soft-deleted form by ID
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
