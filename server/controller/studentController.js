// userController.js

const User = require('../models/User'); // Adjust the path according to your project structure

// Fetch all students (excluding admin and college admins)
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'Student' }); // Fetch only users with role 'student'
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a student
const editStudent = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, email, address, phone } = req.body;
  
    // Input validation example
    if (!firstname || !lastname || !email || !address || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    // Optional: Validate email format (you can use regex or a library like validator)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }
  
    try {
      const updatedStudent = await User.findByIdAndUpdate(
        id,
        { firstname, lastname, email, address, phone },
        { new: true, runValidators: true } // runValidators ensures the new values meet schema validation
      );
  
      if (!updatedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Optional: Log the update
      console.log(`Student updated: ${updatedStudent}`);
  
      res.json(updatedStudent);
    } catch (error) {
      console.error('Error updating student:', error);
      // More specific error handling can be added here based on error types
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Delete a student
const deleteStudent = async (req, res) => {
    const { id } = req.params;
    console.log('Attempting to delete student with ID:', id); // Add this line
  
    try {
      const deletedStudent = await User.findByIdAndDelete(id);
  
      if (!deletedStudent) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  

// Exporting the functions
module.exports = {
  getAllStudents,
  editStudent,
  deleteStudent,
};