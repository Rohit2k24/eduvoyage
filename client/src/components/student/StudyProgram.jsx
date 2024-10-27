import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';

const StudyProgram = () => {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [offeredCourses, setOfferedCourses] = useState([]);
  const navigate = useNavigate();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchApprovedColleges();
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

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f0f4f8',
      minHeight: '100vh',
    },
    header: {
      fontSize: '2.8rem',
      color: '#2c3e50',
      marginBottom: '40px',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      fontWeight: '700',
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
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      backgroundColor: '#fff',
      border: '1px solid #e0e0e0',
    },
    collegeName: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#34495e',
    },
    collegeInfo: {
      fontSize: '1rem',
      color: '#7f8c8d',
      marginBottom: '5px',
    },
    courseList: {
      marginTop: '40px',
    },
    courseListHeader: {
      fontSize: '2rem',
      color: '#2c3e50',
      marginBottom: '25px',
      textAlign: 'center',
      fontWeight: '600',
    },
    courseCard: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '25px',
      marginBottom: '25px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)',
      transition: 'transform 0.3s ease',
    },
    courseName: {
      fontSize: '1.3rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '15px',
    },
    courseDetails: {
      fontSize: '1rem',
      color: '#34495e',
      marginBottom: '20px',
      lineHeight: '1.6',
    },
    applyButton: {
      backgroundColor: '#3498db',
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
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Study Programs</h1>
      <div style={styles.collegeList}>
        {colleges.map((college) => (
          <div
            key={college._id}
            style={styles.collegeCard}
            onClick={() => handleCollegeClick(college)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
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
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={styles.courseName}>{course.courseName}</h3>
              <p style={styles.courseDetails}>Duration: {course.duration}</p>
              <p style={styles.courseDetails}>Price: ${course.price}</p>
              <button
                style={styles.applyButton}
                onClick={() => handleApply(course)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
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
    </div>
  );
};

export default StudyProgram;
