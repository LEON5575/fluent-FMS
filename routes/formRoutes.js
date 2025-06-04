let express = require("express");
let router = express.Router();
let formController = require("../controllers/formController.js");

const auth = require('../middlewares/auth');
let  validAuth = require('../middlewares/authValid');

// All routes are protected with auth middleware
router.use(auth);
router.use(validAuth);
// Create a new form for a project
router.post("/projects/:projectId/forms", formController.createForm);

// Get all forms for a project
router.get("/projects/:projectId/forms", formController.getAllForms);

// Get a form by ID
router.get("/:id", formController.getFormById);

// Update a form by ID
router.put("/:id", formController.updateForm);

// Soft delete a form by ID
router.delete("/:id", formController.deleteForm);

// Restore a soft-deleted form by ID
router.patch("/:id/restore", formController.restoreForm);


module.exports = router;