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

module.exports = {
  createContact
};