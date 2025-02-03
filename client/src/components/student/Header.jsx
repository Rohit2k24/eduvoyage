// src/components/student/Header.jsx

import React from 'react';
import './header.css'; // Create a CSS file for styles if needed
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = async () => {
    await onLogout(); // Call the passed logout function
    navigate('/'); // Navigate to the login page or home page
  };

  if (!user) return null;

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="user-profile">
          <div className="avatar">
            {user.firstname?.[0]}{user.lastname?.[0]}
          </div>
          <div className="user-info">
            <h3 className="user-name">{user.firstname} {user.lastname}</h3>
            <span className="user-email">{user.email}</span>
          </div>
        </div>
        
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
