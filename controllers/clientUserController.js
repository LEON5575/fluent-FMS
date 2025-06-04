const ClientUser = require('../models/clientUser');
const generateToken = require('../utils/generateToken'); // Adjust the path as per your project

// Admin creates a new client user
exports.createClientUser = async (req, res) => {
  try {
    const { name, email, password, clientId, projectId } = req.body;

    const existing = await ClientUser.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await ClientUser.create({ name, email, password, clientId, projectId });

    res.json({
      message: 'Client user created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        clientId: user.clientId,
        projectId: user.projectId
      }
    });
  } catch (err) {
    res.json({ message: 'Error creating user', error: err.message });
  }
};

// Get all client users
exports.getClientUsers = async (req, res) => {
  try {
    const users = await ClientUser.find()
      .select('-password')
      .populate('clientId')   // Populate Client details
      .populate('projectId'); // Populate Project details
    res.json(users);
  } catch (err) {
    res.json({ message: 'Failed to get client users', error: err.message });
  }
};

// Get single client user by id
exports.getClientUser = async (req, res) => {
  try {
    const user = await ClientUser.findById(req.params.id)
      .select('-password')
      .populate('clientId')
      .populate('projectId');
    if (!user) return res.json({ message: 'Client user not found' });
    res.json(user);
  } catch (err) {
    res.json({ message: 'Failed to get client user', error: err.message });
  }
};

// Update client user by id
exports.updateClientUser = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      // Hash password before updating
      const bcrypt = require('bcryptjs');
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await ClientUser.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.json({ message: 'Client user not found' });
    res.json({ message: 'Client user updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update client user', error: err.message });
  }
};

// Soft delete client user by id (assuming a deleted flag)
// Soft delete client user by updating status
exports.deleteClientUser = async (req, res) => {
  try {
    const user = await ClientUser.findOne({ _id: req.params.id, status: 1 });
    if (!user) return res.status(404).json({ message: 'Client user not found or already deleted' });

    user.status = 5; // Mark as deleted
    await user.save();

    res.json({ message: 'Client user soft deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete client user', error: err.message });
  }
};

// Restore soft deleted client user by updating status
exports.restoreClientUser = async (req, res) => {
  try {
    const user = await ClientUser.findOne({ _id: req.params.id, status: 5 });
    if (!user) return res.status(404).json({ message: 'Client user not found or not deleted' });

    user.status = 1; // Restore to active
    await user.save();

    res.json({ message: 'Client user restored' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to restore client user', error: err.message });
  }
};


// Client user login
exports.loginClientUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await ClientUser.findOne({ email });
    if (!user) return res.json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.json({ message: 'Invalid email or password' });

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        clientId: user.clientId,
        projectId: user.projectId
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Logout client user
exports.logoutClientUser = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out successfully' });
};

// Get logged-in user's profile
exports.getClientUserProfile = async (req, res) => {
  try {
    const user = await ClientUser.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

//get clientUser by client Id
exports.getClientUsersByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;

    const users = await ClientUser.find({ clientId, status: 1 })
      .select('-password')
      .populate('clientId')
      .populate('projectId');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get client users by clientId', error: err.message });
  }
};

//get  clientUser by Project Id
exports.getClientUsersByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;

    const users = await ClientUser.find({ projectId, status: 1 })
      .select('-password')
      .populate('clientId')
      .populate('projectId');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get client users by projectId', error: err.message });
  }
};

