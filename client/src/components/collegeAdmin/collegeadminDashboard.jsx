import React, { useState, useEffect } from 'react';
import './CollegeAdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import CollegeSidebar from '../Sidebar/CollegeSidebar';
import { useNavigate } from 'react-router-dom';

const CollegeAdminDashboard = () => {
  const [collegeInfo, setCollegeInfo] = useState({});
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalCourses: 0
  });
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`);
      localStorage.removeItem('token');
      localStorage.removeItem('collegeId');
      localStorage.removeItem('role');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const collegeId = localStorage.getItem('collegeId');
      // Fetch college info
      const collegeResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/college/${collegeId}`);
      setCollegeInfo(collegeResponse.data);
        
      // Check if payment is verified
      if (!collegeResponse.data.paymentVerified) {
        setShowPaymentModal(true);
        return;
      }

      // Fetch applications
      const applicationsResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/student-enroll-course/${collegeId}`);
      const applications = applicationsResponse.data.data;

      // Calculate statistics
      setStats({
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'pending').length,
        approvedApplications: applications.filter(app => app.status === 'approved').length,
        rejectedApplications: applications.filter(app => app.status === 'rejected').length,
        totalCourses: collegeResponse.data.courses?.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // const handlePayment = async () => {
  //   try {
  //     const collegeId = localStorage.getItem('collegeId');

  //     // Step 1: Create an order on the server
  //     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payauth/create-order`, {
  //       amount: 1000, // Amount in INR (1000 paise = 10 INR)
  //       currency: 'INR',
  //     });

  //     const { id: orderId } = response.data;

  //     // Step 2: Initialize Razorpay payment
  //     const options = {
  //       key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your Razorpay Key ID
  //       amount: response.data.amount,
  //       currency: response.data.currency,
  //       name: 'Your College Name',
  //       description: 'Payment for College Dashboard Access',
  //       order_id: orderId,
  //       handler: async (response) => {
  //         // Step 3: Verify payment and update payment status
  //         try {
  //           await axios.put(`${import.meta.env.VITE_BASE_URL}/api/auth/verify-payment/${collegeId}`);
  //           setShowPaymentModal(false);
  //           fetchDashboardData();
  //         } catch (error) {
  //           console.error('Error verifying payment:', error);
  //         }
  //       },
  //       prefill: {
  //         name: 'Your Name',
  //         email: 'your-email@example.com',
  //         contact: '9999999999',
  //       },
  //       theme: {
  //         color: '#F37254',
  //       },
  //     };

  //     const paymentObject = new window.Razorpay(options);
  //     paymentObject.open();
  //   } catch (error) {
  //     console.error('Error during payment process:', error);
  //   }
  // };

  return (
    <div className="college-admin-dashboard">
      <CollegeSidebar handleLogout={handleLogout} />
      <div className="college-dashboard-content">
        {loading ? (
          <div>Loading dashboard data...</div>
        ) : (
          <>
            <div className="college-welcome-section">
              <h1>Welcome, {collegeInfo.collegeName}</h1>
              <p>Manage your college applications and courses from this dashboard</p>
            </div>

            <div className="college-stats-container">
              <div className="college-stat-card">
                <div className="college-stat-number">{stats.totalApplications}</div>
                <div className="college-stat-label">Total Applications</div>
              </div>
              <div className="college-stat-card">
                <div className="college-stat-number">{stats.pendingApplications}</div>
                <div className="college-stat-label">Pending Applications</div>
              </div>
              <div className="college-stat-card">
                <div className="college-stat-number">{stats.approvedApplications}</div>
                <div className="college-stat-label">Approved Applications</div>
              </div>
              <div className="college-stat-card">
                <div className="college-stat-number">{stats.totalCourses}</div>
                <div className="college-stat-label">Total Courses</div>
              </div>
            </div>

            <div className="college-info-section">
              <h2>College Information</h2>
              <div className="college-info-grid">
                <div className="college-info-item">
                  <div className="college-info-label">Email</div>
                  <div className="college-info-value">{collegeInfo.email}</div>
                </div>
                <div className="college-info-item">
                  <div className="college-info-label">Address</div>
                  <div className="college-info-value">{collegeInfo.address}</div>
                </div>
                <div className="college-info-item">
                  <div className="college-info-label">Country</div>
                  <div className="college-info-value">{collegeInfo.country}</div>
                </div>
                <div className="college-info-item">
                  <div className="college-info-label">Contact Person</div>
                  <div className="college-info-value">{collegeInfo.contactPerson}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} backdrop="static" className="custom-modal">
        <Modal.Header>
          <Modal.Title>Payment Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>You need to complete the initial payment to access the dashboard.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePayment}>
            Complete Payment
          </Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default CollegeAdminDashboard;
