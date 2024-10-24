const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EducationCourseSchema = new Schema({
  courseName: {
    type: String,
    required: true,
  },
  courseDescription: {
    type: String,
    required: true,
  },
  isDisabled: { type: Boolean, default: false },  // New field to track course status
});

const EducationCourse = mongoose.model('EducationCourse', EducationCourseSchema);
module.exports = EducationCourse;
