const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const payauthroutes=require('./auth')
const { getAllStudents, editStudent, deleteStudent, getMyCourses } = require('../controller/studentController');
const { getCurrentUser } = require('../controller/userDetailsController');
const { addCourse, getCourseCount, getCourses } = require('../controller/courseController');
const { enrollCourse } = require('../controller/enrollcourseController');
const auth = require('../middleware/authMiddleware');
const educationCourseController = require('../controller/educationCourseController');
const userController = require('../controller/userController');
const { recommendCourses } = require('../controller/educationCourseController');
const paymentRoutes = require('./paymentRoutes');
const { uploadCourseNotes, downloadCourseNotes, getCourseNotes } = require('../controller/notesController');
const examController = require('../controller/examController');

router.get('/questions/:courseId', examController.getExamQuestions);
router.post('/submit', examController.submitExam);
router.get('/certificate/:examId', examController.generateCertificate);
router.use('/auth', authRoutes);
router.use('/payauth',payauthroutes)

router.get('/role-counts', userController.getUserRoleCounts);

router.get('/users',userController.getAllUsers)

router.get('/student', getAllStudents); 

router.get('/student/my-courses/:studentId', auth, getMyCourses);

router.put('/student-edit/:id', editStudent); 

router.delete('/student-del/:id', deleteStudent); 

router.get('/current-user', auth, getCurrentUser);

router.post('/courses', addCourse);

router.get('/course-count', getCourseCount);

router.get('/course-view', getCourses);

router.post('/enroll-course', enrollCourse);

router.post('/course-add', educationCourseController.addCourses);

router.get('/fetch-courses', educationCourseController.fetchCourses);

router.get('/courses-count', educationCourseController.countCourses);

router.put('/course-update/:id',educationCourseController.courseupdate);

router.put('/course-disable/:courseId', educationCourseController.disableCourse);  // Route to disable a course

router.get('/disabled-courses', educationCourseController.getDisabledCourses);

router.put('/course-enable/:courseId', educationCourseController.enableCourse);

router.delete('/course-delete/:id', educationCourseController.delete1);

router.put('/users/:id', userController.updateUser);

router.post('/offer-course',educationCourseController.offerCourse);
// In your routes file
router.post('/remove-course-offer', educationCourseController.remove_course_offer);

router.get('/offered-courses/:collegeId', educationCourseController.getOfferedCourses);

router.post('/recommend-courses', recommendCourses);

router.use('/payment', paymentRoutes)

router.post('/upload-course-notes', uploadCourseNotes);
router.get('/download-course-notes/:fileName', downloadCourseNotes);
router.get('/course-notes/:courseId', getCourseNotes);

router.put('/update-course-progress', auth, educationCourseController.updateCourseProgress);
router.put('/update-course-status', auth, educationCourseController.updateCourseStatus);

router.get('/student/completed-courses/:studentId', auth, examController.getCompletedCourses);

router.get('/exam/questions/:courseId', auth, examController.getExamQuestions);
router.post('/exam/submit', auth, examController.submitExam);
router.get('/exam/certificate/:certificateId', auth, examController.generateCertificate);

router.get('/student/certificates/:studentId', auth, examController.getStudentCertificates);

module.exports = router;