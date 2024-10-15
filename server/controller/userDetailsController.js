// controllers/userController.js
const User = require('../models/User'); // Adjust the path as necessary

// Controller to get the current user
const getCurrentUser = async (req, res) => {
  try {
    // Use req.user which is set by the auth middleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getCurrentUser,
};
