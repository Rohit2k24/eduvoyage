const mongoose = require("mongoose");
const EducationCourse = require("../models/EducationCourse");
const OfferedCourse = require("../models/OfferedCourse");
const College = require("../models/College");
const Enroll = require("../models/Enroll");
const path = require("path");
const fs = require("fs");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Add a new course
const addCourses = async (req, res) => {
  try {
    console.log(req.body); // Log the incoming request data
    const { courseName, courseDescription } = req.body;

    // Validate input data
    if (!courseName || !courseDescription) {
      return res
        .status(400)
        .json({ message: "Course name and description are required." });
    }

    // Create a new course instance
    const newCourse = new EducationCourse({
      courseName,
      courseDescription,
    });

    // Save the course to the database
    const savedCourse = await newCourse.save();

    return res.status(201).json({
      message: "Course added successfully",
      course: savedCourse,
    });
  } catch (error) {
    console.error("Error adding course:", error);

    // Check if the error is a validation error from Mongoose
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
};

// Fetch courses
const fetchCourses = async (req, res) => {
  try {
    const courses = await EducationCourse.find({ isDisabled: false });
    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Count courses
const countCourses = async (req, res) => {
  try {
    const count = await EducationCourse.countDocuments();
    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error counting courses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update a course
const courseupdate = async (req, res) => {
  const { id } = req.params;
  const { courseName, courseDescription } = req.body;

  try {
    const updatedCourse = await EducationCourse.findByIdAndUpdate(
      id,
      { courseName, courseDescription },
      { new: true } // Returns the modified document rather than the original
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Disable a course
const disableCourse = async (req, res) => {
  console.log("Entered the backend");
  const { courseId } = req.params;
  try {
    await EducationCourse.findByIdAndUpdate(courseId, { isDisabled: true });
    res.status(200).json({ message: "Course disabled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to disable course" });
  }
};

// Get disabled courses
const getDisabledCourses = async (req, res) => {
  try {
    const disabledCourses = await EducationCourse.find({ isDisabled: true });
    console.log("Disabled Courses fetched: ", disabledCourses);
    res.status(200).json(disabledCourses);
  } catch (error) {
    console.error("Error fetching disabled courses:", error);
    res.status(500).json({ error: "Failed to fetch disabled courses" });
  }
};

// Enable a course
const enableCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    await EducationCourse.findByIdAndUpdate(courseId, { isDisabled: false });
    res.status(200).json({ message: "Course enabled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to enable course" });
  }
};

// Delete a course
const delete1 = async (req, res) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await EducationCourse.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Server error while deleting the course" });
  }
};

// Offer a course
const offerCourse = async (req, res) => {
  console.log("Entered the backend");
  try {
    console.log("Received offer course request:", req.body);

    const {
      courseId,
      courseName,
      courseDescription,
      duration,
      price,
      collegeId,
    } = req.body;

    if (!collegeId) {
      return res.status(400).json({ message: "College ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(collegeId)) {
      return res.status(400).json({ message: "Invalid College ID" });
    }

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(400).json({ message: "College not found" });
    }

    const alreadyOfferedCourse = await OfferedCourse.find({
      collegeId,
      courseId,
    });
    console.log(alreadyOfferedCourse);

    if (alreadyOfferedCourse.length > 0) {
      return res.status(400).json({ message: "Course already offered" });
    } else {
      const newOfferedCourse = new OfferedCourse({
        collegeId,
        courseId,
        courseName,
        courseDescription,
        duration,
        price: parseFloat(price),
      });

      console.log("New offered course object:", newOfferedCourse);

      const savedCourse = await newOfferedCourse.save();
      console.log("Saved course:", savedCourse);

      res.status(201).json({
        message: "Course offered successfully",
        offeredCourse: savedCourse,
      });
    }
  } catch (error) {
    console.error("Error offering course:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const remove_course_offer = async (req, res) => {
  const { courseId, collegeId } = req.body;
  console.log("Received request to remove course offer:", req.body);

  try {
    const result = await OfferedCourse.findOneAndDelete({
      courseId,
      collegeId,
    });
    if (!result) {
      return res.status(404).json({ message: "Offered course not found" });
    }
    console.log("Course offer removed:", result);
    res.status(200).json({ message: "Course offer removed successfully" });
  } catch (error) {
    console.error("Error removing course offer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const studentEnrollCourse = async (req, res) => {
  try {
    // File validation
    if (req.file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          message: "Invalid file type. Only PDF, JPEG, and PNG files are allowed." 
        });
      }

      if (req.file.size > maxSize) {
        return res.status(400).json({ 
          message: "File size too large. Maximum size is 5MB." 
        });
      }
    }

    // Check for existing application
    const existingApplication = await Enroll.findOne({
      studentId: req.body.studentId,
      courseId: req.body.courseId,
      status: "pending"
    });

    if (existingApplication) {
      return res.status(400).json({ 
        message: "You already have a pending application for this course" 
      });
    }

    const {
      fullName,
      dateOfBirth,
      gender,
      nationality,
      email,
      phone,
      identification,
      englishProficiencyScore,
      studyMode,
      fundingSource,
      courseId,
      collegeId,
      highestQualification,
      degreeName,
      institution,
      yearOfCompletion,
      gpa,
      studentId,
      passportnumber
    } = req.body;

    // Save the uploaded file to the uploads directory
    let percentageFilePath = "";
    if (req.file) {
      const uploadPath = path.join(
        __dirname,
        "..",
        "uploads",
        req.file.originalname
      );
      fs.writeFileSync(uploadPath, req.file.buffer);
      percentageFilePath = uploadPath; // Store the file path in the variable
    }

    // Create a new enrollment document with nested previousEducation fields
    const enrollment = new Enroll({
      fullName,
      dateOfBirth,
      gender,
      nationality,
      email,
      phone,
      identification,
      englishProficiencyScore,
      studyMode,
      fundingSource,
      courseId,
      collegeId,
      studentId,
      passportnumber,
      previousEducation: {
        highestQualification,
        degreeName,
        institution,
        yearOfCompletion,
        gpa,
      },
      percentageFilePath,
      status: "pending",
    });

    await enrollment.save();

    res.status(201).json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error enrolling student:", error);
    res.status(500).json({ 
      message: "Error submitting application",
      error: error.message 
    });
  }
};

const getStudentEnroll = async (req, res) => {
  const { collegeId } = req.params;
  console.log(collegeId);
  try {
    const enrollments = await Enroll.find({collegeId : collegeId})
      .populate("studentId")
      .populate("courseId")
      .populate("collegeId");

    if (enrollments.length === 0) {
      return res.status(404).json({ message: "No student enrollments found" });
    }

    res.status(200).json({
      message: "Student enrollments retrieved successfully",
      data: enrollments,
    });
  } catch (error) {
    console.error("Error in getStudentEnroll:", error);
    res.status(500).json({
      message: "Error retrieving student enrollments",
      error: error.message,
    });
  }
};

const getOfferedCourses = async (req, res) => {
  const { collegeId } = req.params;
  try {
    const courses = await OfferedCourse.find({ collegeId }); // Adjust based on your database structure
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching offered courses." });
  }
};

const approveApplication = async (req, res) => {
  const { applicationId } = req.params;
  try {
    const application = await Enroll.findByIdAndUpdate(applicationId, { status: "approved" }, { new: true });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const userEmail = application.email;

    // Send email notification
    await sendEmailNotification(
      userEmail,
      "Application Approved",
      "Congratulations! Your application has been approved."
    );

    res.status(200).json({ message: "Application approved successfully", data: application });
  } catch (error) {
    console.error("Error approving application:", error);
    res.status(500).json({ message: "Error approving application" });
  }
}

const rejectApplication = async (req, res) => {
  const { applicationId } = req.params;
  try {
    const application = await Enroll.findByIdAndUpdate(
      applicationId, 
      { 
        status: "rejected",
        updatedAt: new Date()
      }, 
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const userEmail = application.email;

    await sendEmailNotification(
      userEmail,
      "Application Rejected",
      "We regret to inform you that your application has been rejected."
    );

    res.status(200).json({ message: "Application rejected successfully", data: application });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({ message: "Error rejecting application" });
  }
}


const sendEmailNotification = async (email, subject, message) => {
  console.log(email, subject, message);
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const getStudentApplications = async (req, res) => {
  try {
    const { studentId } = req.params;
    const applications = await Enroll.find({ studentId })
      .sort({ createdAt: -1 }); // Sort by creation date, newest first
    res.status(200).json(applications);
  } catch (error) {
    console.error('Error fetching student applications:', error);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

const getCollegeInfo = async (req, res) => {
  try {
    const { collegeId } = req.params;
    const college = await College.findById(collegeId);
    
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.status(200).json(college);
  } catch (error) {
    console.error("Error fetching college info:", error);
    res.status(500).json({ message: "Error fetching college information" });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const { collegeId } = req.params;

    // Get all applications for the college
    const applications = await Enroll.find({ collegeId });
    
    // Get all courses offered by the college
    const courses = await OfferedCourse.find({ collegeId });

    // Calculate statistics
    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length,
      approvedApplications: applications.filter(app => app.status === 'approved').length,
      rejectedApplications: applications.filter(app => app.status === 'rejected').length,
      totalCourses: courses.length
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
};

module.exports = {
  addCourses,
  fetchCourses,
  countCourses,
  courseupdate,
  disableCourse,
  getDisabledCourses,
  enableCourse,
  delete1,
  offerCourse,
  remove_course_offer,
  studentEnrollCourse,
  getStudentEnroll,
  getOfferedCourses,
  approveApplication,
  rejectApplication,
  getStudentApplications,
  getCollegeInfo,
  getDashboardStats,
};
