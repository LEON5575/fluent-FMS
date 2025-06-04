const mongoose = require("mongoose");
const formSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  formIdString: {
    type: String,
    required: true,
    unique: true,
  },
  linkedSmtpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SMTPConfig",
    required: true,
  },
  adminTemplateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmailTemplateAdmin",
    required: true,
  },
  userTemplateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmailTemplateUser",
    required: true,
  },
    active: {
    type: Boolean,
    default: true
  },
  status: {
    type: Number,
    enum: [1, 5],
    default: 1,
  },
}, {
  timestamps: true,
});

// Auto-populate and exclude soft-deleted
formSchema.pre(/^find/, function(next) {
  if (!this.getQuery().hasOwnProperty('status')) {
    this.where({ status: 1 });
  }

  this.populate('projectId')
      .populate('linkedSmtpId')
      .populate('adminTemplateId')
      .populate('userTemplateId');
  next();
});

module.exports = mongoose.model("Form", formSchema);
