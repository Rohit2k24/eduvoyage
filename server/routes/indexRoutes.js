const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const { getUserRoleCounts, getAllUsers } = require('../controller/userController');
const { getAllStudents, editStudent, deleteStudent } = require('../controller/studentController');

const { getCurrentUser } = require('../controller/userDetailsController');
const { addCourse, getCourseCount, getCourses } = require('../controller/courseController');
const { enrollCourse } = require('../controller/enrollcourseController');
const auth = require('../middleware/authMiddleware');


router.use('/auth', authRoutes);
router.get('/role-counts', getUserRoleCounts);
router.get('/users',getAllUsers)



router.get('/student', getAllStudents); // Get all students
router.put('/student-edit/:id', editStudent); // Edit a student
router.delete('/student-del/:id', deleteStudent); // Delete a student



router.get('/current-user', auth, getCurrentUser);




router.post('/courses', addCourse);
router.get('/course-count', getCourseCount);
router.get('/course-view', getCourses);


router.post('/enroll-course', enrollCourse);

module.exports = router;