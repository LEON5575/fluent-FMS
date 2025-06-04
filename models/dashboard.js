const mongoose = require('mongoose');
const Project = require('./Project');
const Form = require('./Form');
const FormSubmission = require('./formSubmission');



// Define a fake schema to allow static methods
const dashboardSchema = new mongoose.Schema({}, { strict: false });

dashboardSchema.statics.getProjectsByClient = async function (clientId) {
  return await Project.find({ clientId });
};

dashboardSchema.statics.getFormsByClient = async function (clientId) {
  return await Form.find({ clientId });
};

dashboardSchema.statics.getSubmissionsByClient = async function (clientId) {
  return await FormSubmission.find({ clientId });
};

module.exports = mongoose.model('Dashboard', dashboardSchema);
