const Razorpay = require('razorpay');
const crypto = require('crypto');
const Enroll = require('../models/Enroll')

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.enrollPayment = async (req, res) => {
    const { userId, courseId, collegeId, amount } = req.body;

    try {
        const receiptId = `receipt_${crypto.randomBytes(8).toString("hex")}`;

        const options = {
            amount: amount * 100,  
            currency: 'INR',
            receipt: receiptId,
        };

        const order = await razorpayInstance.orders.create(options);

        const paymentDoc = await Enroll.findOneAndUpdate(
            { studentId: userId, courseId: courseId, collegeId: collegeId },
            {
                razorpayOrderId: order.id,
                receiptId: receiptId,
                paymentStatus: 'pending',
                currency: options.currency,
                amount: options.amount
            },
            { new: true, upsert: false }
        );

        if (!paymentDoc) {
            return res.status(404).json({ message: "Enrollment document not found." });
        }

        return res.status(200).json({
            orderId: order.id,
            key: process.env.RAZORPAY_KEY_ID,
            amount: options.amount,
            currency: options.currency,
            receipt: receiptId,
        });

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        return res.status(500).json({ message: 'Error creating Razorpay order', error });
    }
};

exports.confirmPayment = async (req, res) => {
    const { razorpayOrderId, paymentId, signature, userId, courseId, collegeId } = req.body;
  
    try {
      const paymentDoc = await Enroll.findOne({
        studentId: userId,
        courseId: courseId,
        collegeId: collegeId,
        razorpayOrderId: razorpayOrderId
      });
  
      if (!paymentDoc) {
        return res.status(404).json({ message: 'Enrollment document not found.' });
      }
  
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${paymentId}`)
        .digest('hex');
  
      if (generatedSignature !== signature) {
        return res.status(400).json({ message: 'Invalid payment signature.' });
      }

      paymentDoc.paymentStatus = 'completed';
      paymentDoc.paymentId = paymentId;
      paymentDoc.signature = signature;
      await paymentDoc.save();
  
      return res.status(200).json({ message: 'Payment confirmed successfully.', paymentDoc });
    } catch (error) {
      console.error('Error confirming payment:', error);
      return res.status(500).json({ message: 'Error confirming payment.', error });
    }
  };
