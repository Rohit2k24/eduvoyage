const EducationCourse = require('../models/EducationCourse');

// Add a new course
const addCourses = async (req, res) => {
  try {
    console.log(req.body); // Log the incoming request data
    const { courseName, courseDescription } = req.body;

    // Validate input data
    if (!courseName || !courseDescription) {
      return res.status(400).json({ message: 'Course name and description are required.' });
    }

    // Create a new course instance
    const newCourse = new EducationCourse({
      courseName,
      courseDescription,
    });

    // Save the course to the database
    const savedCourse = await newCourse.save();

    return res.status(201).json({
      message: 'Course added successfully',
      course: savedCourse,
    });
  } catch (error) {
    console.error('Error adding course:', error);

    // Check if the error is a validation error from Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
const fetchCourses = async (req, res) => {
    try {
      const courses = await EducationCourse.find(); // Use EducationCourse instead of Course
      return res.status(200).json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  const countCourses = async (req, res) => {
    try {
      const count = await Course.countDocuments(); // Count the total number of courses
      return res.status(200).json({ count }); // Send the count back to the client
    } catch (error) {
      console.error('Error counting courses:', error);
      return res.status(500).json({ message: 'Internal server error' }); // Handle error
    }
  };

module.exports = {
  addCourses,fetchCourses,countCourses
};
