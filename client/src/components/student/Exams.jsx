import React, { useEffect, useState } from 'react';
import StudentSidebar from '../Sidebar/StudentSidebar';
import './studentDashboard.css';
import Header from './Header'; 
import axios from 'axios';

const Exams = () => {
  const [user, setUser] = useState({ firstname: '', lastname: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`);
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
      marginLeft: '250px',
    },
    header: {
      fontSize: '2.5rem',
      color: '#343a40',
      marginBottom: '20px',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '700',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
    },
    examsTitle: {
      marginTop: '40px',
      fontSize: '2.5rem',
      color: '#343a40',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '700',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
    },
  };

  return (
    <div className="student-dashboard">
      <StudentSidebar />
      <div style={styles.container}>
        <Header user={user} onLogout={handleLogout} />
        <h1 style={styles.examsTitle}>Exams</h1>
        {/* Add your content for the Exams page here */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default Exams;
