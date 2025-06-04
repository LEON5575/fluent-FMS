const mongoose = require("mongoose");

const formSubmissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
  submissionData: {
    type: Object,
    required: true,
  },
  status: {
    type: Number,
    enum: [1, 5], // 1 = active, 5 = soft-deleted
    default: 1,
  },
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model("FormSubmission", formSubmissionSchema);
