const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure env vars are loaded

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
    enum: [1, 5], // 1: active, 5: deleted
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
  active: {
    type: Boolean,
    default: true
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

// Auto-update timestamps on save
projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

//  Soft delete method
projectSchema.methods.softDelete = async function () {
  this.status = 5;
  this.updatedAt = Date.now();
  return await this.save();
};

//  Exclude soft-deleted projects from all find queries unless explicitly overridden
projectSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty('status')) {
    this.find({ status: 1 });
  }
  next();
});

// Generate a token specific to this project (used for form access)
projectSchema.methods.generateProjectToken = function () {
  const payload = {
    _id: this._id,
    name: this.name,
    clientId: this.clientId
  };

  return jwt.sign(payload, process.env.PROJECT_TOKEN_SECRET, {
    expiresIn: '4d'
  });
};

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
