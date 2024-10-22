// models/Enroll.js
const mongoose = require('mongoose');

const enrollSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  enrolledDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Enroll', enrollSchema);
