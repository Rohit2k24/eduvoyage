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
  enrolledDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Enroll', enrollSchema);
