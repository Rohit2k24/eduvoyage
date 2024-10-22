// enrollController.js
const Enroll = require('../models/Enroll'); // Assuming you have an Enroll model
const Course = require('../models/Course');
const User = require('../models/User');

const enrollCourse = async (req, res) => {
  console.log("Entered enrollCourse controller");
  try {
    const { salutation, name, email, phone, courseId, courseName, duration, price } = req.body;

    // Find or create the user based on email
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        salutation,
        name,
        email,
        phone,
        role: 'student' // Assuming all enrollees are students
      });
      await user.save();
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is already enrolled
    const alreadyEnrolled = await Enroll.findOne({ userId: user._id, courseId: courseId });
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create a new enrollment record
    const enrollment = new Enroll({
      userId: user._id,
      courseId: course._id,
      courseName,
      duration,
      price,
      enrolledDate: new Date(),
    });

    await enrollment.save();

    return res.status(200).json({ message: 'Enrolled successfully!' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  enrollCourse,
};
