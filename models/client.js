const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  status: {
    type: Number,
    enum: [1, 5], // 1: live, 5: deleted
    default: 1
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
clientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add a method to soft delete
clientSchema.methods.softDelete = async function() {
  this.status = 5;
  this.updatedAt = Date.now();
  return await this.save();
};

// Modify all find queries to exclude soft deleted documents by default
clientSchema.pre(/^find/, function(next) {
  // Add status condition only if not explicitly included in query
  if (!this.getQuery().hasOwnProperty('status')) {
    this.find({ status: 1 });
  }
  next();
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;