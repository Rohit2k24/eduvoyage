import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import StudentSidebar from '../Sidebar/StudentSidebar';
import Header from './Header';
import ApplicationForm from './ApplicationForm';

const AvailableCourses = () => {
  const location = useLocation();
  const { college } = location.state;
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchOfferedCourses(college._id);
    fetchApplications();
  }, [college._id]);

  const fetchOfferedCourses = async (collegeId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/offered-courses/${collegeId}`);
      setOfferedCourses(response.data);
    } catch (error) {
      console.error('Error fetching offered courses:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const studentId = localStorage.getItem('studentId');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/student-applications/${studentId}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const getApplicationStatus = (courseId) => {
    const courseApplications = applications
      .filter(app => app.courseId === courseId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return courseApplications.length > 0 ? courseApplications[0].status : null;
  };

  const getPaymentStatus = (courseId) => {
    const courseApplications = applications
      .filter(app => app.courseId === courseId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    return courseApplications.length > 0 ? courseApplications[0].paymentStatus : null;
  };
  

  const renderActionButton = (course) => {
    const status = getApplicationStatus(course.courseId);
    const paymentStatus = getPaymentStatus(course.courseId); // Assume getPaymentStatus fetches payment status for the course
  
    if (status === 'approved' && paymentStatus === 'completed') {
      return (
        <button
          style={{ ...styles.applyButton, backgroundColor: '#27ae60' }}
          disabled
        >
          Payment Done
        </button>
      );
    }
  
    switch(status) {
      case 'pending':
        return (
          <button
            style={{ ...styles.applyButton, backgroundColor: '#f39c12' }}
            disabled
          >
            Application Under Process
          </button>
        );
      case 'approved':
        return (
          <button
            style={{ ...styles.applyButton, backgroundColor: '#27ae60' }}
            onClick={() => handlePayment(course)}
          >
            Pay Now
          </button>
        );
      case 'rejected':
        return (
          <button
            style={styles.rejected}
            onClick={() => {
              setSelectedCourse(course);
              setShowApplicationForm(true);
            }}
          >
            Application Rejected - Apply Again
          </button>
        );
      default:
        return (
          <button
            style={styles.applyButton}
            onClick={() => {
              setSelectedCourse(course);
              setShowApplicationForm(true);
            }}
          >
            Apply Now
          </button>
        );
    }
  };
  

  const handleApply = (course) => {
    setSelectedCourse(course);
    setShowApplicationForm(true);
  };

  const handlePayment = async (course) => {
    try {
      const studentId = localStorage.getItem('studentId');

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/enroll-payment`, {
        userId: studentId,
        courseId: course.courseId,
        collegeId: college._id,
        amount: course.price
      });
      console.log(response);
  
      const { orderId, key, amount, currency } = response.data;
  
      
      const options = {
        key: key, 
        amount: amount, 
        currency: currency,
        name: college.collegeName,
        description: `Payment for ${course.courseName}`,
        order_id: orderId, 
        handler: async function (response) {
          const paymentData = {
            razorpayOrderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          };
  

          await axios.post(`${import.meta.env.VITE_BASE_URL}/api/payment/confirm-payment`, {
            ...paymentData,
            userId: studentId,
            courseId: course.courseId,
            collegeId: college._id
          });
  
          fetchApplications(); 
          alert("Payment successful! Your application is complete.");
        },
        prefill: {
          name: localStorage.getItem('studentName') || '', 
          email: localStorage.getItem('studentEmail') || '',
        },
        theme: {
          color: "#007bff"
        }
      };
  
      const paymentGateway = new window.Razorpay(options);
      paymentGateway.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert("There was an error initiating the payment. Please try again.");
    }
  };
  
  // Reusing styles from StudyProgram.jsx
  const styles = {
    container: {
      flex: 1,
      padding: '80px 20px 40px',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      marginLeft: '250px',
    },
    header: {
      fontSize: '2.5rem',
      color: '#343a40',
      marginBottom: '40px',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '700',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
    },
    courseList: {
      marginTop: '40px',
    },
    courseCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '25px',
      marginBottom: '25px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
    },
    courseName: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      color: '#343a40',
      marginBottom: '15px',
    },
    courseDetails: {
      fontSize: '1rem',
      color: '#495057',
      marginBottom: '20px',
      lineHeight: '1.6',
    },
    applyButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '12px 25px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      fontSize: '1rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)',
    },
    rejected: {
      backgroundColor: '#ff4444',
      color: 'white',
      '&:hover': {
        backgroundColor: '#cc0000'
      }
    }
  };

  return (
    <div className="student-dashboard">
      <StudentSidebar />
      <div style={styles.container}>
        <Header user={{}} onLogout={() => {}} />
        <h1 style={styles.header}>{college.collegeName} - Available Courses</h1>
        <div style={styles.courseList}>
          {offeredCourses.map((course) => (
            <div
              key={course.courseId}
              style={styles.courseCard}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <h3 style={styles.courseName}>{course.courseName}</h3>
              <p style={styles.courseDetails}>Duration: {course.duration}</p>
              <p style={styles.courseDetails}>Price: ${course.price}</p>
              {renderActionButton(course)}
            </div>
          ))}
        </div>
        {showApplicationForm && (
          <ApplicationForm
            course={selectedCourse}
            college={college}
            onClose={() => {
              setShowApplicationForm(false);
              fetchApplications();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AvailableCourses; 