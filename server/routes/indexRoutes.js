const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const { getUserRoleCounts, getAllUsers } = require('../controller/userController');
const { getAllStudents, editStudent, deleteStudent } = require('../controller/studentController');
const { getCurrentUser } = require('../controller/userDetailsController');
const { addCourse, getCourseCount, getCourses } = require('../controller/courseController');
const { enrollCourse } = require('../controller/enrollcourseController');
const auth = require('../middleware/authMiddleware');
const educationCourseController = require('../controller/educationCourseController');


router.use('/auth', authRoutes);

router.get('/role-counts', getUserRoleCounts);

router.get('/users',getAllUsers)

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

module.exports = router;