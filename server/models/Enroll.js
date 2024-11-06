const mongoose = require('mongoose');

const enrollSchema = new mongoose.Schema({
  fullName: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String },
  nationality: { type: String },
  email: { type: String },
  phone: { type: String },
  passportnumber: { type: String },
  studyMode: { type: String },
  previousEducation: {
    highestQualification: { type: String },
    degreeName: { type: String },
    institution: { type: String },
    yearOfCompletion: { type: Number },
    gpa: { type: String },
  },
  percentageFilePath: { type: String },
  fundingSource: { type: String },
  studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  enrolledDate: { type: Date, default: Date.now },
  status: { type: String, default: "pending" }
}, { 
  timestamps: true 
});

// Add compound index for studentId and courseId
enrollSchema.index({ studentId: 1, courseId: 1 });

module.exports = mongoose.model('Enroll', enrollSchema);
