const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
// const { userDetailsController } = require('../controller/userConrtoller');

router.post('/register', authController.userRegister);

router.post('/login', authController.userLogin);
router.post('/logout',authController.logout)
// router.get('/user-details',userDetailsController)

module.exports = router;