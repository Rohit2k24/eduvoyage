const express = require('express');
const router = express.Router();
const College = require('../models/College');
const Razorpay = require('razorpay');
const authController = require('../controller/authController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Your Razorpay Key ID
  key_secret: process.env.RAZORPAY_KEY_SECRET // Your Razorpay Key Secret
});

// Other routes...

// Route to create a Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount, currency } = req.body; // Get amount and currency from request body

  const options = {
    amount: amount * 100, // Amount in paise
    currency: currency,
    receipt: `receipt_order_${Math.random() * 100000}`, // Unique receipt ID
  };

  try {
    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({ message: 'Error creating order' });
  }
});


// Update the register-college route to handle multiple files
router.post('/register-college', upload.fields([
  { name: 'accreditationCertificate', maxCount: 1 },
  { name: 'legalDocuments', maxCount: 1 },
  { name: 'collegeImage', maxCount: 1 }
]), authController.registerCollege);

// Other routes...

module.exports = router; 