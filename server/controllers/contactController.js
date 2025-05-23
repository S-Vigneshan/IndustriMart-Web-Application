const Contact = require('../models/Contact');

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new contact message
    const contact = new Contact({
      name,
      email,
      message
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully"
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: "Error sending message"
    });
  }
};
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error('Fetch contacts error:', error);
    res.status(500).json({
      success: false,
      message: "Error fetching contacts"
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found"
      });
    }
    res.status(200).json({
      success: true,
      message: "Contact deleted successfully"
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: "Error deleting contact"
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  deleteContact
};