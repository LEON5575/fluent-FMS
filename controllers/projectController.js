const Project = require("../models/project");

// Get all projects (including option to get deleted ones)
exports.getProjects = async (req, res) => {
  try {
    const { includeDeleted } = req.query;
    let query = {};

    // If includeDeleted is true, get all projects including deleted ones
    if (includeDeleted === "true") {
      query = { status: { $in: [1, 5] } };
    }

    const projects = await Project.find(query)
      .populate("clientId", "name email company")
      .sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching projects", error: error.message });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const { includeDeleted } = req.query;
    let query = { _id: req.params.id };

    // If includeDeleted is true, allow fetching deleted projects
    if (includeDeleted === "true") {
      query.status = { $in: [1, 5] };
    }

    const project = await Project.findOne(query).populate(
      "clientId",
      "name email company"
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching project", error: error.message });
  }
};

// Get projects by client
exports.getClientProjects = async (req, res) => {
  try {
    const { includeDeleted } = req.query;
    let query = { clientId: req.params.clientId };

    // If includeDeleted is true, get all projects including deleted ones
    if (includeDeleted === "true") {
      query.status = { $in: [1, 5] };
    }

    const projects = await Project.find(query)
      .populate("clientId", "name email company")
      .sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching client projects",
        error: error.message,
      });
  }
};

// Create new project
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    await project.populate("clientId", "name email company");
    res.status(201).json(project);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating project", error: error.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, status: 1 });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or already deleted" });
    }

    Object.assign(project, req.body);
    await project.save();
    await project.populate("clientId", "name email company");
    res.status(200).json(project);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating project", error: error.message });
  }
};

// Soft delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, status: 1 });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or already deleted" });
    }

    await project.softDelete();
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
};

// Restore deleted project
exports.restoreProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, status: 5 });
    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found or not deleted" });
    }

    project.status = 1;
    await project.save();
    await project.populate("clientId", "name email company");
    res.status(200).json({ message: "Project restored successfully", project });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error restoring project", error: error.message });
  }
};
