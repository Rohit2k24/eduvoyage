const mongoose = require('mongoose');

const enrollSchema = new mongoose.Schema({
  fullName: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String },
  nationality: { type: String },
  email: { type: String },
  phone: { type: String },
  identification: { type: String },
  englishProficiencyScore: { type: Number },
  studyMode: { type: String },
  previousEducation: {
    highestQualification: { type: String },
    degreeName: { type: String },
    institution: { type: String },
    yearOfCompletion: { type: Number },
    gpa: { type: String },
  },
  percentageFilePath: { type: String }, // Save file path here after upload
  fundingSource: { type: String },
  studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  enrolledDate: { type: Date, default: Date.now },
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model('Enroll', enrollSchema);
