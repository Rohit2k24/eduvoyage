const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

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

router.put('/approve-college/:id', authController.approvecollege)

router.get('/colleges', authController.getAllColleges)

router.post('/college-login', authController.collegeLogin);

router.patch('/colleges/:id/disable', authController.disableCollege);

router.get('/download/accreditation/:collegeName', authController.downloadAccreditation)

router.get('/download/legal/:collegeName', authController.downloadLegal)

router.post('/login-for-all', authController.LoginForAll);

router.delete('/decline-college/:id',authController.deletereqcollege);

module.exports = router;
