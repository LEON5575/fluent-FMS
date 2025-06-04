const Project = require('../models/Project');
const Form = require('../models/Form');
const FormSubmission = require('../models/formSubmission');
const Dashboard = require('../models/dashboard');
const Pagination = require('../utils/pagination');
function getMonth() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}
//^ Get all projects for a client (monthly + paginated)
exports.getProjects = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { start, end } = getMonth();
    const { page, limit, skip } = Pagination(req);

    const [total, projects] = await Promise.all([
      Project.countDocuments({ clientId, createdAt: { $gte: start, $lte: end } }),
      Project.find({ clientId, createdAt: { $gte: start, $lte: end } }).skip(skip).limit(limit)
    ]);

    res.json({
      data: projects,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.json({ message: 'Error fetching projects', error: error.message });
  }
};

// ^Get all forms for a client (monthly + paginated)
exports.getForms = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { start, end } = getMonth();
    const { page, limit, skip } = Pagination(req);

    const [total, forms] = await Promise.all([
      Form.countDocuments({ clientId, createdAt: { $gte: start, $lte: end } }),
      Form.find({ clientId, createdAt: { $gte: start, $lte: end } }).skip(skip).limit(limit)
    ]);

    res.json({
      data: forms,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.json({ message: 'Error fetching forms', error: error.message });
  }
};

// ^ Get all form submissions for a client (monthly + paginated)
exports.getSubmissions = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { start, end } = getMonth();
    const { page, limit, skip } = Pagination(req);

    const [total, submissions] = await Promise.all([
      FormSubmission.countDocuments({ clientId, createdAt: { $gte: start, $lte: end } }),
      FormSubmission.find({ clientId, createdAt: { $gte: start, $lte: end } }).skip(skip).limit(limit)
    ]);

    res.json({
      data: submissions,
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.json({ message: 'Error fetching submissions', error: error.message });
  }
};

//^Get dashboard overview (counts only)
exports.getOverview = async (req, res) => {
  try {
    const { clientId } = req.params;
    const [projects, forms, submissions] = await Promise.all([
      Dashboard.getProjectsByClient(clientId),
      Dashboard.getFormsByClient(clientId),
      Dashboard.getSubmissionsByClient(clientId),
    ]);

    res.json({
      counts: {
        projects: projects.length,
        forms: forms.length,
        submissions: submissions.length
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error building overview", error: err.message });
  }
};



   // data: {
      //   projects,
      //   forms,
      //   submissions
      // }