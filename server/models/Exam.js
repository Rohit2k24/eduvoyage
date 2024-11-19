const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EducationCourse',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema); 