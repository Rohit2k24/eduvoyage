const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EducationCourse',
    required: true
  },
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true
  },
  examScore: {
    type: Number,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  certificateNumber: {
    type: String,
    unique: true
  }
}, { timestamps: true });

// Generate unique certificate number before saving
certificateSchema.pre('save', function(next) {
  if (!this.certificateNumber) {
    this.certificateNumber = 'CERT-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema); 