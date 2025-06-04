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
    // 1: active, 5: soft deleted
    status: {
      type: Number,
      enum: [1, 5],
      default: 1
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
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Update the updatedAt timestamp before saving
smtpConfigSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Soft delete method (marks as deleted, doesn't remove from DB)
smtpConfigSchema.methods.softDelete = async function () {
  this.status = 5;
  this.deleted = true;
  this.updatedAt = Date.now();
  return await this.save();
};

// Automatically exclude soft-deleted configs unless status is explicitly queried
smtpConfigSchema.pre(/^find/, function (next) {
  if (!this.getQuery().hasOwnProperty("status")) {
    this.find({ status: 1 });
  }
  next();
});

module.exports = mongoose.model("SMTPConfig", smtpConfigSchema);
