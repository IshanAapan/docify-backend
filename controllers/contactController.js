const Contact = require('../models/Contact');
const User = require('../models/User');

exports.submitContactForm = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;
    const userId = req.user.userId;

    // Create new contact entry
    const contact = new Contact({
      user: userId,
      fullName,
      email,
      message
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been submitted successfully!',
      contact
    });

  } catch (error) {
    console.error(error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};
