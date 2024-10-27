const mongoose = require('mongoose');

const enrollSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  identification: {
    type: String,
    required: true,
  },
  previousEducation: {
    type: String,
    required: true,
  },
  englishProficiencyScore: {
    type: Number,
    required: true,
  },
  studyMode: {
    type: String,
    required: true,
  },
  fundingSource: {
    type: String,
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  enrolledDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model('Enroll', enrollSchema);
