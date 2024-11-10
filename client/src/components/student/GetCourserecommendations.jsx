import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetCourseRecommendations = () => {
  const [interests, setInterests] = useState('');
  const [studyMode, setStudyMode] = useState('');
  const [budget, setBudget] = useState('');
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [courseFields, setCourseFields] = useState([]);

  useEffect(() => {
    const fetchCourseFields = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/course-fields`);
        setCourseFields(response.data);
      } catch (error) {
        console.error('Error fetching course fields:', error);
      }
    };

    fetchCourseFields();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('${import.meta.env.VITE_BASE_URL}/api/recommend-courses', {
        interests,
        studyMode,
        budget,
      });
      setRecommendedCourses(response.data);
    } catch (error) {
      console.error('Error recommending courses:', error);
      setErrorMessage('Failed to recommend courses.');
    }
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: 'auto',
    },
    header: {
      fontSize: '2rem',
      marginBottom: '20px',
      color: '#343a40',
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      fontSize: '1rem',
      color: '#495057',
      marginBottom: '5px',
      display: 'block',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ced4da',
      fontSize: '1rem',
      color: '#495057',
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '600',
      transition: 'background-color 0.3s ease',
      width: '100%',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    errorMessage: {
      color: '#dc3545',
      marginTop: '10px',
      textAlign: 'center',
    },
    courseList: {
      marginTop: '20px',
      borderTop: '1px solid #dee2e6',
      paddingTop: '20px',
    },
    courseItem: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '15px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    courseName: {
      fontSize: '1.5rem',
      color: '#007bff',
      marginBottom: '10px',
    },
    courseDescription: {
      fontSize: '1rem',
      color: '#495057',
      marginBottom: '5px',
    },
    courseDetails: {
      fontSize: '0.9rem',
      color: '#6c757d',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Get Course Recommendations</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Field of Interest:</label>
          <select
            style={styles.input}
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            required
          >
            <option value="">Select a field</option>
            {courseFields.map((field, index) => (
              <option key={index} value={field}>{field}</option>
            ))}
          </select>
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Budget (in USD):</label>
          <input
            type="number"
            style={styles.input}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Duration (in months):</label>
          <input
            type="text"
            style={styles.input}
            value={studyMode}
            onChange={(e) => setStudyMode(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Get Recommendations
        </button>
      </form>

      {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}

      <h3 style={styles.header}>Recommended Courses</h3>
      <div style={styles.courseList}>
        <ul>
          {recommendedCourses.map(course => (
            <li key={course._id} style={styles.courseItem}>
              <h4 style={styles.courseName}>{course.courseName}</h4>
              <p style={styles.courseDescription}>{course.courseDescription}</p>
              <p style={styles.courseDetails}>Offered by: {course.collegeId.collegeName}</p>
              <p style={styles.courseDetails}>Duration: {course.duration} months</p>
              <p style={styles.courseDetails}>Price: ${course.price}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GetCourseRecommendations;
