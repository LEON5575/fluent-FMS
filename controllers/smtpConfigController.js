const SMTPConfig = require("../models/smtpConfig.js");

//^create config based on project id
exports.createConfig = async (req, res) => {
  try {
    const { projectId } = req.params;
    const configData = {
      ...req.body,
      projectId
    };
    const config = await SMTPConfig.create(configData);
    res.status(201).json(config);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create SMTP config",
      error: error.message
    });
  }
};

// Get all configs based on project ID
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

// Get config by ID
exports.getConfigById = async (req, res) => {
  try {
    const config = await SMTPConfig.findById(req.params.id);
    if (!config)
      return res.status(404).json({ message: "SMTP config not found" });
    res.status(200).json(config);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving config", error: error.message });
  }
};

// Update config
exports.updateConfig = async (req, res) => {
  try {
    const config = await SMTPConfig.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!config)
      return res.status(404).json({ message: "SMTP config not found" });
    res.status(200).json(config);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update SMTP config", error: error.message });
  }
};

// Soft Delete config
exports.deleteConfig = async (req, res) => {
  try {
    const config = await SMTPConfig.findOne({ _id: req.params.id, status: 1 });
    if (!config) {
      return res
        .status(404)
        .json({ message: "SMTP config not found or already deleted" });
    }
    config.status = 5;
    await config.save();
    res.status(200).json({ message: "SMTP config soft-deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete SMTP config", error: error.message });
  }
};

//smtp restore config
exports.restoreConfig = async (req, res) => {
  try {
    const config = await SMTPConfig.findOne({ _id: req.params.id, status: 5 });
    if (!config) {
      return res
        .status(404)
        .json({ message: "SMTP config not found or not deleted" });
    }
    config.status = 1;
    await config.save();
    res.status(200).json({ message: "SMTP config restored successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error restoring SMTP config", error: error.message });
  }
};

// Soft delete project
// exports.deleteConfig = async (req, res) => {
//   try {
//     const smtpConfigs = await smtpConfig.findOne({
//       _id: req.params.id,
//       status: 1,
//     });
//     if (!smtpConfigs) {
//       return res
//         .status(404)
//         .json({ message: "SMTPConfig not found or already deleted" });
//     }

//     await smtpConfigs.softDelete();
//     res.status(200).json({ message: "SMTPConfig deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error deleting SMTPConfig", error: error.message });
//   }
// };

// //restore deleted SMTPConfig
// exports.restoreConfig = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: "Invalid ID format" });
//     }

//     // Skip the default status: 1 filter by passing the option skipStatusFilter: true
//     const smtpConfigs = await smtpConfig.findOne({ _id: id, status: 5 }).setOptions({ skipStatusFilter: true });

//     if (!smtpConfigs) {
//       return res.status(404).json({ message: "SMTPConfig not found or not deleted" });
//     }

//     smtpConfigs.status = 1;
//     smtpConfigs.deleted = false;
//     await smtpConfigs.save();

//     res.status(200).json({
//       message: "SMTPConfig restored successfully",
//       smtpConfigs,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error restoring SMTPConfig", error: error.message });
//   }
// };
