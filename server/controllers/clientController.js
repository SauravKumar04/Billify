const Client = require("../models/Client");

const createClient = async (req, res) => {
  try {
    const client = await Client.create({ ...req.body, user: req.user._id });
    return res.status(201).json(client);
  } catch (error) {
    return res.status(500).json({ message: "Could not create client", error: error.message });
  }
};

const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(clients);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch clients", error: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json(client);
  } catch (error) {
    return res.status(500).json({ message: "Could not update client", error: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const deleted = await Client.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: "Client not found" });
    }

    return res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete client", error: error.message });
  }
};

module.exports = {
  createClient,
  getClients,
  updateClient,
  deleteClient,
};
