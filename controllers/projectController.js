const Project = require("../models/Project");
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
    res.json(projects);
  } catch (error) {
    res.json({ message: "Error fetching projects", error: error.message });
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
      return res.json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.json({ message: "Error fetching project", error: error.message });
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
    res.json(projects);
  } catch (error) {
    res.json({
        message: "Error fetching client projects",
        error: error.message,
      });
  }
};

// Create Project with token, only if active is true
exports.createProject = async (req, res) => {
  try {
    // Check if project is active
    if (!req.body.active) {
      return res.json({
        message: "Cannot create project: project must be active."
      });
    }

    const project = new Project(req.body);
    await project.save();

    const token = project.generateProjectToken();

    await project.populate("clientId", "name email company");

    res.json({
      message: "Project created successfully",
      projectToken: token,
      project,
    });
  } catch (error) {
    res.json({
      message: "Error creating project",
      error: error.message,
    });
  }
};

// exports.createProject = async (req, res) => {
//   try {
//     const project = new Project(req.body);
//     await project.save();

//     const token = project.generateProjectToken();

//     await project.populate("clientId", "name email company");

//     res.status(201).json({
//       message: "Project created successfully",
//       projectToken: token,
//       project,
//     });
//   } catch (error) {
//     res.status(400).json({
//       message: "Error creating project",
//       error: error.message,
//     });
//   }
// };

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, status: 1 });
    if (!project) {
      return res.json({ message: "Project not found or already deleted" });
    }

    Object.assign(project, req.body);
    await project.save();
    await project.populate("clientId", "name email company");
    res.json(project);
  } catch (error) {
    res.json({ message: "Error updating project", error: error.message });
  }
};

// Soft delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, status: 1 });
    if (!project) {
      return res.json({ message: "Project not found or already deleted" });
    }

    await project.softDelete();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.json({ message: "Error deleting project", error: error.message });
  }
};

// Restore deleted project
exports.restoreProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, status: 5 });
    if (!project) {
      return res
        .json({ message: "Project not found or not deleted" });
    }

    project.status = 1;
    await project.save();
    await project.populate("clientId", "name email company");
    res.json({ message: "Project restored successfully", project });
  } catch (error) {
    res.json({ message: "Error restoring project", error: error.message });
  }
};


//create project without token generation
// exports.createProject = async (req, res) => {
//   try {
//     const project = new Project(req.body);
//     await project.save();
//     let token = user.generateAuthToken();
//     res.json({
//       token,
//     })
//     await project.populate("clientId", "name email company");
//     res.status(201).json(project);
//   } catch (error) {
//     res
//       .status(400)
//       .json({ message: "Error creating project", error: error.message });
//   }
    
// };

//?filter endpoints
// Filter projects by name (and optionally other filters)
exports.filterProjects = async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};

    if (name) {
      // Use case-insensitive regex to match project names containing the search string
      query.name = new RegExp(name, 'i');
    }

    const projects = await Project.find(query)
      .populate('clientId', 'name email company')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.json({ message: 'Error filtering projects', error: error.message });
  }
};

