const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    formIdString: {
      type: String,
      required: true,
      unique: true, // if needed
    },
    linkedSmtpId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SMTPConfig",
      required: true,
    },
    adminTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailTemplate",
      required: true,
    },
    userTemplateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmailTemplate",
      required: true,
    },
    status: {
      type: Number,
      enum: [1, 5], // 1 = active, 5 = soft-deleted
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Form", formSchema);
