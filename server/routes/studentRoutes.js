const express = require('express');
const router = express.Router();
const { getAllStudents, getMyCourses } = require('../controller/studentController');

router.get('/students', getAllStudents);

module.exports = router;
