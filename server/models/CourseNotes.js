const mongoose = require('mongoose');

const courseNotesSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CourseNotes', courseNotesSchema); 