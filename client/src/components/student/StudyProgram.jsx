// src/components/student/StudyProgram.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';
import StudentSidebar from '../Sidebar/StudentSidebar';
import Header from './Header'; // Import the Header component
import './studentDashboard.css'; // Import your CSS for global styles

const StudyProgram = () => {
  const [user, setUser] = useState({ firstname: '', lastname: '' });
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchApprovedColleges();
    // Fetch user data here and set it, e.g., setUser({ firstname: 'John', lastname: 'Doe' });
  }, []);

  const fetchApprovedColleges = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/approved-colleges');
      console.log(response.data);
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching approved colleges:', error);
    }
  };

  const fetchOfferedCourses = async (collegeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/offered-courses/${collegeId}`);
      setOfferedCourses(response.data);
    } catch (error) {
      console.error('Error fetching offered courses:', error);
    }
  };

  const handleCollegeClick = (college) => {
    setSelectedCollege(college);
    fetchOfferedCourses(college._id);
  };

  const handleApply = (course) => {
    setSelectedCourse(course);
    setShowApplicationForm(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem("token");
      localStorage.removeItem('studentId');
      localStorage.removeItem("role");
    } catch (error) {
      console.error('Error logging out:', error);
      setErrorMessage('Logout failed. Please try again.');
    }
  };

  const styles = {
    container: {
      flex: 1,
      padding: '40px 20px',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      marginLeft: '250px', // Match sidebar width
    },
    header: {
      marginTop:'40px',
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
    collegeList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '30px',
      marginBottom: '50px',
    },
    collegeCard: {
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: '#fff',
      border: '1px solid #dee2e6',
      position: 'relative',
      overflow: 'hidden',
    },
    collegeName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#007bff',
    },
    collegeInfo: {
      fontSize: '1rem',
      color: '#6c757d',
      marginBottom: '5px',
    },
    courseList: {
      marginTop: '40px',
    },
    courseListHeader: {
      fontSize: '2rem',
      color: '#343a40',
      marginBottom: '25px',
      textAlign: 'center',
      fontWeight: '600',
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
  };

  return (
    <div className="student-dashboard">
      <StudentSidebar />
      <div style={styles.container}>
        <Header user={user} onLogout={handleLogout} /> {/* Pass user and logout function */}
        <h1 style={styles.header}>Study Programs</h1>
        <div style={styles.collegeList}>
          {colleges.map((college) => (
            <div
              key={college._id}
              style={styles.collegeCard}
              onClick={() => handleCollegeClick(college)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.15)';
              }}
            >
              <h2 style={styles.collegeName}>{college.collegeName}</h2>
              <p style={styles.collegeInfo}>{college.address}</p>
              <p style={styles.collegeInfo}>{college.country}</p>
            </div>
          ))}
        </div>
        {selectedCollege && (
          <div style={styles.courseList}>
            <h2 style={styles.courseListHeader}>{selectedCollege.collegeName} Offered Courses</h2>
            {offeredCourses.map((course) => (
              <div
                key={course._id}
                style={styles.courseCard}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <h3 style={styles.courseName}>{course.courseName}</h3>
                <p style={styles.courseDetails}>Duration: {course.duration}</p>
                <p style={styles.courseDetails}>Price: ${course.price}</p>
                <button
                  style={styles.applyButton}
                  onClick={() => handleApply(course)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
        {showApplicationForm && (
          <ApplicationForm
            course={selectedCourse}
            college={selectedCollege}
            onClose={() => setShowApplicationForm(false)}
          />
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Display logout error message */}
      </div>
    </div>
  );
};

export default StudyProgram;
