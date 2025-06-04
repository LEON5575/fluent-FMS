const mongoose = require("mongoose");

const smtpConfigSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    host: {
      type: String,
      required: true,
      trim: true
    },
    port: {
      type: Number,
      required: true
    },
    secure: {
      type: Boolean,
      default: false
    },
    authUser: {
      type: String,
      required: true,
      trim: true
    },
    authPass: {
      type: String,
      required: true
    },
    fromEmail: {
      type: String,
      trim: true
    },
    status: {
      type: Number,
      enum: [1, 5], // 1: active, 5: soft-deleted
      default: 1
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Update `updatedAt` on save
smtpConfigSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Auto-exclude soft-deleted
smtpConfigSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("status")) {
    this.find({ status: 1 });
  }
  next();
});

// Soft delete method
smtpConfigSchema.methods.softDelete = async function () {
  this.status = 5;
  this.deleted = true;
  this.updatedAt = Date.now();
  return await this.save();
};

module.exports = mongoose.model("SMTPConfig", smtpConfigSchema);
