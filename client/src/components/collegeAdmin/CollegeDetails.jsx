// CollegeDetails.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CollegeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { college } = location.state; // Access selected college passed from StudyProgram

  const styles = {
    container: {
      padding: '40px 20px',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    header: {
      fontSize: '2.5rem',
      color: '#2c3e50',
      marginBottom: '40px',
      textAlign: 'center',
    },
    cardContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '30px',
    },
    card: {
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      width: '300px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '15px',
    },
  };

  const handleCardClick = (cardType) => {
    switch (cardType) {
      case 'courses':
        navigate('/available-courses', { state: { college } });
        break;
      case 'support':
        navigate('/help-support', { state: { college } });
        break;
      case 'scholarship':
        navigate('/apply-scholarship', { state: { college } });
        break;
      default:
        break;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>{college.collegeName}</h1>
      <div style={styles.cardContainer}>
        <div
          style={styles.card}
          onClick={() => handleCardClick('courses')}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <h2 style={styles.cardTitle}>Available Courses</h2>
        </div>
        <div
          style={styles.card}
          onClick={() => handleCardClick('support')}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <h2 style={styles.cardTitle}>Help & Support</h2>
        </div>
        <div
          style={styles.card}
          onClick={() => handleCardClick('scholarship')}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-5px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <h2 style={styles.cardTitle}>Apply for Scholarship</h2>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;
