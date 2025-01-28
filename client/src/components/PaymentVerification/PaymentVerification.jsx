import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentVerification = () => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      // Step 1: Create an order on the server
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payauth/create-order`, {
        amount: 1000, // Amount in INR (1000 paise = 10 INR)
        currency: 'INR',
      });

      const { id: orderId } = response.data;

      // Step 2: Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'Eduvoyage',
        description: 'Payment for College Dashboard Access',
        order_id: orderId,
        handler: async (response) => {
          // Step 3: Verify payment and update payment status
          try {
            const collegeId = localStorage.getItem('collegeId');
            if (!collegeId) {
              console.error('College ID is not set in local storage.');
              return;
            }
            await axios.put(`${import.meta.env.VITE_BASE_URL}/api/auth/verify-payment/${collegeId}`);
            navigate('/collegeadminDashboard'); // Redirect to the dashboard after successful payment
          } catch (error) {
            console.error('Error verifying payment:', error);
          }
        },
        prefill: {
          name: 'Your Name',
          email: 'your-email@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error during payment process:', error);
    }
  };

//   useEffect(() => {
//     handlePayment(); // Automatically trigger payment on component mount
//   }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Payment Verification</h2>
      <p>Proceed with the payment to complete the Registration process.</p>
      <button onClick={handlePayment} style={{ padding: '12px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
        Complete Payment
      </button>
    </div>
  );
};

export default PaymentVerification; 