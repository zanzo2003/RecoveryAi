const User = require('../models/User');

const getContacts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('emergencyContacts');
    res.json({ contacts: user.emergencyContacts || [] });
  } catch {
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
};

const addContact = async (req, res) => {
  const { name, phone, relation } = req.body;
  if (!name || !phone || !relation) {
    return res.status(400).json({ message: 'Name, phone, and relation required' });
  }
  try {
    const user = await User.findById(req.user.id);
    user.emergencyContacts.push({ name, phone, relation });
    await user.save();
    res.json({ contacts: user.emergencyContacts });
  } catch {
    res.status(500).json({ message: 'Failed to add contact' });
  }
};

const updateContact = async (req, res) => {
  const { contactId } = req.params;
  const { name, phone, relation } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const contact = user.emergencyContacts.id(contactId);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    contact.name = name || contact.name;
    contact.phone = phone || contact.phone;
    contact.relation = relation || contact.relation;
    await user.save();
    res.json({ contacts: user.emergencyContacts });
  } catch {
    res.status(500).json({ message: 'Failed to update contact' });
  }
};

const deleteContact = async (req, res) => {
  const { contactId } = req.params;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const contact = user.emergencyContacts.id(contactId);
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    contact.deleteOne();
    await user.save();
    res.json({ contacts: user.emergencyContacts });
  } catch {
    res.status(500).json({ message: 'Failed to delete contact' });
  }
};

module.exports = { getContacts, addContact, updateContact, deleteContact };
