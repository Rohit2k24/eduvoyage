const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  maxEnrollment: { type: Number, required: true },
  description: { type: String, required: true },
  // imageUrl field is removed
});

module.exports = mongoose.model('Course', CourseSchema);
