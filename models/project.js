const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  status: {
    type: Number,
    enum: [1, 5], // 1: live, 5: deleted
    default: 1
  },
  projectStatus: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'on-hold'],
    default: 'pending'
  },
  budget: {
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the timestamps before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add a method to soft delete
projectSchema.methods.softDelete = async function() {
  this.status = 5;
  this.updatedAt = Date.now();
  return await this.save();
};

// Modify all find queries to exclude soft deleted documents by default
projectSchema.pre(/^find/, function(next) {
  // Add status condition only if not explicitly included in query
  if (!this.getQuery().hasOwnProperty('status')) {
    this.find({ status: 1 });
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 