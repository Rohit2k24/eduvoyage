const mongoose = require("mongoose");

const enrollSchema = new mongoose.Schema(
  {
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
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "EducationCourse" },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    enrolledDate: { type: Date, default: Date.now },
    status: { type: String, default: "pending" },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    receiptId: {
      type: String,
    },
    amount: {
      type: String,
  
    },
    currency: {
      type: String,
      default: "INR",
    },
    razorpayOrderId: {
      type: String,
    },
    paymentId: {
      type: String,
    },
    signature: {
      type: String,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: true,
  }
);

// Add compound index for studentId and courseId
enrollSchema.index({ studentId: 1, courseId: 1 });

module.exports = mongoose.model("Enroll", enrollSchema);
