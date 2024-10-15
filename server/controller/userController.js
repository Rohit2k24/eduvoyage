// controllers/userController.js
const User = require('../models/User');

// Get user counts by role
const getUserRoleCounts = async (req, res) => {
  try {
    // Count users based on roles
    const studentCount = await User.countDocuments({ role: 'Student' });
    const collegeAdminCount = await User.countDocuments({ role: 'collegeAdmin' });
    const AdminCount = await User.countDocuments({ role: 'Admin' });
    // const sellerCount = await User.countDocuments({ role: 'seller' }); // Add more roles if needed

    // Return the counts as a response
    res.status(200).json({
      studentCount,
      collegeAdminCount,
      AdminCount,
      // Add more role counts here
    });
  } catch (err) {
    console.error('Error fetching user role counts:', err);
    res.status(500).json({ message: 'Failed to fetch user role counts' });
  }
};

const getAllUsers = async (req, res) => {
    try {
      // Fetch users where role is not 'admin'
      const users = await User.find({ role: { $ne: 'admin' } });
      
      // Check if any users are found
      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found' });
      }
  
      // Respond with the fetched users
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

module.exports = { getUserRoleCounts ,getAllUsers};
