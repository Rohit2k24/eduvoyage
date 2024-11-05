const express = require('express');
const router = express.Router();
const { getAllStudents } = require('../controller/studentController');

router.get('/students', getAllStudents);

module.exports = router;
