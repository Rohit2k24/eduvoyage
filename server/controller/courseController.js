const Course = require('../models/Course'); // Import the Course model

// Get the total number of courses
const getCourseCount = async (req, res) => {
    try {
        const count = await Course.countDocuments({});
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching course count:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get course enrollment data
const getCourses = async (req, res) => {
    try {
      const courses = await Course.find(); // Fetch all courses from the database
      res.status(200).json(courses); // Send the courses as a response
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Error fetching courses' }); // Handle errors
    }
  };

// Create a new course
const addCourse = async (req, res) => {
    const { courseName, courseDuration, coursePrice, maxEnrollment, courseDescription } = req.body;

    // Validate input
    if (!courseName || !courseDuration || !coursePrice || !maxEnrollment || !courseDescription) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newCourse = new Course({
            courseName,
            courseDuration,
            coursePrice,
            maxEnrollment,
            courseDescription,
        });

        await newCourse.save();
        res.status(201).json({ message: 'Course added successfully' });
    } catch (error) {
        console.error('Error adding course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getCourseCount,
    getCourses,
    addCourse,
};
