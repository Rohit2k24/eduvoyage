const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const educationCourseController = require('../controller/educationCourseController');

router.post('/register', authController.userRegister);

router.post('/login', authController.userLogin);

router.post('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPassword);

router.post('/register-college', upload.fields([
  { name: 'accreditationCertificate', maxCount: 1 },
  { name: 'legalDocuments', maxCount: 1 }
]), authController.registerCollege);

router.put('/reset-password/:resetToken', authController.resetPassword);

router.get('/unapproved-colleges', authController.unapprovedColleges);

// COLLEGE APPROVAL & DECLINE

router.put('/approve-college/:id', authController.approvecollege);

router.delete('/decline-college/:id',authController.deletereqcollege);


router.get('/colleges', authController.getAllColleges)

router.post('/college-login', authController.collegeLogin);

router.patch('/colleges/:id/disable', authController.disableCollege);

router.get('/download/accreditation/:collegeName', authController.downloadAccreditation)

router.get('/download/legal/:collegeName', authController.downloadLegal)

router.get('/download/:filePath', authController.downloadPercentageFile)

router.post('/login-for-all', authController.LoginForAll);

router.get('/approved-colleges', authController.getApprovedColleges);

router.get('/offered-courses/:collegeId', authController.getOfferedCourses);


// ENROLL ROUTES

router.post('/student-enroll-course',upload.single('percentageFile'), educationCourseController.studentEnrollCourse);

router.get('/student-enroll-course/:collegeId', educationCourseController.getStudentEnroll);

router.put('/approve-application/:applicationId', educationCourseController.approveApplication);

router.put('/reject-application/:applicationId', educationCourseController.rejectApplication);

router.get('/student-applications/:studentId', educationCourseController.getStudentApplications);

router.get('/college/:collegeId', educationCourseController.getCollegeInfo);

router.get('/dashboard-stats/:collegeId', educationCourseController.getDashboardStats);

module.exports = router;
