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

  const courseupdate= async (req, res) => {
    const { id } = req.params;
    const { courseName, courseDescription } = req.body;
  
    try {
      const updatedCourse = await EducationCourse.findByIdAndUpdate(
        id,
        { courseName, courseDescription },
        { new: true } // Returns the modified document rather than the original
    );
  
      if (!updatedCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      res.status(200).json(updatedCourse); // Respond with the updated course details
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  //DISABLE COURSES

  const disableCourse = async (req, res) => {
    console.log("Entered the backend")
    const { courseId } = req.params;
    try {
      await EducationCourse.findByIdAndUpdate(courseId, { isDisabled: true });
      res.status(200).json({ message: 'Course disabled successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to disable course' });
    }
  };

  const getDisabledCourses = async (req, res) => {
    try {
      const disabledCourses = await EducationCourse.find({ isDisabled: true });
      res.status(200).json(disabledCourses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch disabled courses' });
    }
  };

module.exports = {
  addCourses,fetchCourses,countCourses,courseupdate,disableCourse,getDisabledCourses
};
