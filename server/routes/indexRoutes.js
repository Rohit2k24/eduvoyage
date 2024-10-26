const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const { getAllStudents, editStudent, deleteStudent } = require('../controller/studentController');
const { getCurrentUser } = require('../controller/userDetailsController');
const { addCourse, getCourseCount, getCourses } = require('../controller/courseController');
const { enrollCourse } = require('../controller/enrollcourseController');
const auth = require('../middleware/authMiddleware');
const educationCourseController = require('../controller/educationCourseController');
const userController = require('../controller/userController');


router.use('/auth', authRoutes);

router.get('/role-counts', userController.getUserRoleCounts);

router.get('/users',userController.getAllUsers)

router.get('/student', getAllStudents); 

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
  
module.exports = router;