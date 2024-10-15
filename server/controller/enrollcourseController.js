// enrollController.js
const Enroll = require('../models/Enroll'); // Assuming you have an Enroll model
const Course = require('../models/Course');
const User = require('../models/User');

const enrollCourse = async (req, res) => {
  try {
    const { courseId, userId } = req.body;

    // Find the user and course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: 'User or course not found' });
    }

    // Check if the user is already enrolled
    const alreadyEnrolled = await Enroll.findOne({ userId: userId, courseId: courseId });
    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create a new enrollment record
    const enrollment = new Enroll({
      userId: user._id,
      courseId: course._id,
      enrolledDate: new Date(), // You can track when the user enrolled
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
