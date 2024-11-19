// src/components/student/Header.jsx

import React from 'react';
import './header.css'; // Create a CSS file for styles if needed
import { useNavigate } from 'react-router-dom';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = async () => {
    await onLogout(); // Call the passed logout function
    navigate('/'); // Navigate to the login page or home page
  };

  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      background: 'white',
      borderRadius: '12px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: '#2563eb',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '600',
    },
    userName: {
      fontWeight: '600',
      color: '#1e293b',
    },
    logoutButton: {
      padding: '8px 16px',
      borderRadius: '8px',
      border: 'none',
      background: '#ef4444',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    }
  };

  if (!user) {
    return null; // or return a loading indicator
  }

  return (
    <header style={styles.header}>
      <div style={styles.userInfo}>
        <div style={styles.avatar}>
          {user.firstname?.[0]}{user.lastname?.[0]}
        </div>
        <span style={styles.userName}>
          {user.firstname} {user.lastname}
        </span>
      </div>
      <button 
        style={styles.logoutButton} 
        onClick={handleLogout}
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
