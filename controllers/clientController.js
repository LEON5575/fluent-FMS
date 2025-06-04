const Client = require('../models/client');

// Get all clients (including option to get deleted ones)
exports.getClients = async (req, res) => {
  try {
    const { includeDeleted } = req.query;
    let query = {};
    // If includeDeleted is true, get all clients including deleted ones
    if (includeDeleted === 'true') {
      query = { status: { $in: [1, 5] } };
    }

    const clients = await Client.find(query).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.json({ message: 'Error fetching clients', error: error.message });
  }
};

// Get single client
exports.getClient = async (req, res) => {
  try {
    const { includeDeleted } = req.query;
    let query = { _id: req.params.id };
    
    // If includeDeleted is true, allow fetching deleted clients
    if (includeDeleted === 'true') {
      query.status = { $in: [1, 5] };
    }

    const client = await Client.findOne(query);
    if (!client) {
      return res.json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    res.json({ message: 'Error fetching client', error: error.message });
  }
};

// Create new client
exports.createClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.json(client);
  } catch (error) {
    res.json({ message: 'Error creating client', error: error.message });
  }
};

// Update client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Updating client with ID:', id);

    const client = await Client.findOne({ _id: id, status: 1 });
    if (!client) {
      return res.status(404).json({ message: 'Client not found or already deleted' });
    }

    //console.log('Original client data:', client);
   //console.log('Update payload:', req.body);

    Object.assign(client, req.body);

    await client.save();
    //console.log('Updated client:', client);

    res.json(client);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Error updating client', error: error.message });
  }
};

// Soft delete client
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, status: 1 });
    if (!client) {
      return res.json({ message: 'Client not found or already deleted' });
    }

    await client.softDelete();
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.json({ message: 'Error deleting client', error: error.message });
  }
};

// Restore deleted client
exports.restoreClient = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, status: 5 });
    if (!client) {
      return res.json({ message: 'Client not found or not deleted' });
    }

    client.status = 1;
    await client.save();
    res.json({ message: 'Client restored successfully', client });
  } catch (error) {
    res.json({ message: 'Error restoring client', error: error.message });
  }
};