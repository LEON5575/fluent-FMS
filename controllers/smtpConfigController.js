const SMTPConfig = require("../models/smtpConfig.js");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");


// & Create SMTP config for a specific project
exports.createConfig = async (req, res) => {
  try {
    const { projectId } = req.params;
    const configData = {
      ...req.body,
      projectId
    };
    const config = await SMTPConfig.create(configData);
    res.status(201).json({ message: "SMTP config created", config });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create SMTP config",
      error: error.message
    });
  }
};

// & Get all configs for a specific project
exports.getAllConfigs = async (req, res) => {
  try {
    const { projectId } = req.params;
    const configs = await SMTPConfig.find({ projectId });
    res.status(200).json(configs);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving configs",
      error: error.message
    });
  }
};

// & Get a specific config by ID
exports.getConfigById = async (req, res) => {
  try {
    const config = await SMTPConfig.findById(req.params.id);
    if (!config) {
      return res.status(404).json({ message: "SMTP config not found" });
    }
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving config", error: error.message });
  }
};

// & Update a config by ID
exports.updateConfig = async (req, res) => {
  try {
    const config = await SMTPConfig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!config) {
      return res.status(404).json({ message: "SMTP config not found" });
    }
    res.status(200).json({ message: "SMTP config updated", config });
  } catch (error) {
    res.status(400).json({ message: "Failed to update SMTP config", error: error.message });
  }
};

// & Soft-delete a config
exports.deleteConfig = async (req, res) => {
  try {
    const config = await SMTPConfig.findOne({ _id: req.params.id, status: 1 });
    if (!config) {
      return res.status(404).json({ message: "SMTP config not found or already deleted" });
    }
    config.status = 5;
    config.deleted = true;
    await config.save();
    res.status(200).json({ message: "SMTP config soft-deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete SMTP config", error: error.message });
  }
};

// & Restore a previously soft-deleted config
exports.restoreConfig = async (req, res) => {
  try {
    const config = await SMTPConfig.findOne({ _id: req.params.id, status: 5 });
    if (!config) {
      return res.status(404).json({ message: "SMTP config not found or not deleted" });
    }
    config.status = 1;
    config.deleted = false;
    await config.save();
    res.status(200).json({ message: "SMTP config restored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error restoring SMTP config", error: error.message });
  }
};

// & Send an email using the active SMTP config
exports.sendMail = async (req, res) => {
  try {
    let { smtpId } = req.params; // renamed to smtpId for clarity
    const { to, subject, html } = req.body;

    if (!smtpId || !mongoose.Types.ObjectId.isValid(smtpId)) {
      return res.status(400).json({ message: "Invalid or missing smtpId" });
    }

    const smtp = await SMTPConfig.findOne({ _id: new mongoose.Types.ObjectId(smtpId), status: 1 });
    if (!smtp) {
      return res.status(404).json({ message: "SMTP config not found or inactive" });
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.authUser,
        pass: smtp.authPass
      }
    });

    const info = await transporter.sendMail({
      from: smtp.fromEmail || smtp.authUser,
      to,
      subject,
      html: html + `<br><br><em>Sent via Fluent Form API</em>`
    });

    res.status(200).json({ message: "Email sent", info });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};
