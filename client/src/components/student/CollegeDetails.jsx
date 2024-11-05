import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentSidebar from '../Sidebar/StudentSidebar';
import Header from './Header';

const CollegeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { college } = location.state;

  const handleCardClick = (cardType) => {
    switch (cardType) {
      case 'courses':
        navigate('/studentDashboard/available-courses', { state: { college } });
        break;
      case 'support':
        navigate('/studentDashboard/help-support', { state: { college } });
        break;
      case 'scholarship':
        navigate('/studentDashboard/scholarships', { state: { college } });
        break;
      default:
        break;
    }
  };

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
      marginTop: '40px',
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
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      padding: '20px',
      marginTop: '20px',
      position: 'relative',
      zIndex: 1
    },
    card: {
      padding: '25px',
      borderRadius: '12px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
      backgroundColor: '#fff',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid #dee2e6',
      position: 'relative',
      overflow: 'hidden',
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#007bff',
      marginBottom: '15px',
    }
  };

  return (
    <div className="student-dashboard">
      <StudentSidebar />
      <div style={styles.container}>
        <Header user={{}} onLogout={() => {}} />
        <h1 style={styles.header}>{college.collegeName}</h1>
        <div style={styles.cardContainer}>
          <div
            style={styles.card}
            onClick={() => handleCardClick('courses')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={styles.cardTitle}>Available Courses</h2>
          </div>
          <div
            style={styles.card}
            onClick={() => handleCardClick('support')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={styles.cardTitle}>Help & Support</h2>
          </div>
          <div
            style={styles.card}
            onClick={() => handleCardClick('scholarship')}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h2 style={styles.cardTitle}>Apply for Scholarship</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails; 