const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EducationCourseSchema = new Schema({
  courseName: {
    type: String,
    // required: true,
  },
  courseDescription: {
    type: String,
    // required: true,
  },
 
});

const EducationCourse = mongoose.model('EducationCourse', EducationCourseSchema);
module.exports = EducationCourse;
