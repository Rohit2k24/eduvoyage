const express = require('express');
const router = express.Router();
const paymentController = require('../controller/payController');

router.post('/enroll-payment', paymentController.enrollPayment);

router.post('/confirm-payment', paymentController.confirmPayment);

module.exports = router;