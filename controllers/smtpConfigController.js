const SMTPConfig = require('../models/smtpConfig.js');

// Create new config
exports.createConfig = async (req, res) => {
  try {
    const config = await SMTPConfig.create(req.body);
    res.status(201).json(config);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create SMTP config', error: error.message });
  }
};

// Get all configs
exports.getAllConfigs = async (req, res) => {
  try {
    const configs = await SMTPConfig.find();
    res.status(200).json(configs);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving configs', error: error.message });
  }
};

// Get config by ID
exports.getConfigById = async (req, res) => {
  try {
    const config = await SMTPConfig.findById(req.params.id);
    if (!config) return res.status(404).json({ message: 'SMTP config not found' });
    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving config', error: error.message });
  }
};

// Update config
exports.updateConfig = async (req, res) => {
  try {
    const config = await SMTPConfig.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!config) return res.status(404).json({ message: 'SMTP config not found' });
    res.status(200).json(config);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update SMTP config', error: error.message });
  }
};

// Soft Delete config
exports.deleteConfig = async (req, res) => {
  try {
    const config = await SMTPConfig.findOne({ _id: req.params.id, status: 1 });
    if (!config) {
      return res.status(404).json({ message: 'SMTP config not found or already deleted' });
    }

    config.status = 5;
    await config.save();
    res.status(200).json({ message: 'SMTP config soft-deleted successfully', config });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete SMTP config', error: error.message });
  }
};

//smtp restore config
exports.restoreConfig = async (req, res) => {
  try {
    const config = await SMTPConfig.findOne({ _id: req.params.id, status: 5 });
    if (!config) {
      return res.status(404).json({ message: 'SMTP config not found or not deleted' });
    }

    config.status = 1;
    await config.save();
    res.status(200).json({ message: 'SMTP config restored successfully', config });
  } catch (error) {
    res.status(500).json({ message: 'Error restoring SMTP config', error: error.message });
  }
};
