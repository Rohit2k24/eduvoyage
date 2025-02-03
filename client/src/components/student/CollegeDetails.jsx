import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import StudentSidebar from '../Sidebar/StudentSidebar';
import Header from './Header';
import { FaBars } from 'react-icons/fa';

const CollegeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { college } = location.state;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = {
      firstname: localStorage.getItem('studentName'),
      email: localStorage.getItem('studentEmail'),
      id: localStorage.getItem('studentId')
    };
    setUser(userData);
  }, []);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const styles = {
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
      marginTop: '40px'
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      padding: '2rem',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '2rem',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid #dee2e6',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#007bff',
      marginBottom: '15px',
      textAlign: 'center'
    }
  };

  return (
    <div className="student-dashboard">
      <div className="menu-button" onClick={toggleSidebar}>
        <FaBars />
      </div>
      
      <StudentSidebar isOpen={isSidebarOpen} />
      
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <Header 
          user={user}
          onLogout={() => {
            localStorage.clear();
            navigate('/login');
          }}
        />
        
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