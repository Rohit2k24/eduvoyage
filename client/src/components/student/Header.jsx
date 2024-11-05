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

  return (
    <header className="top-bar">
      <input type="text" placeholder="Search programs, courses..." />
      <div className="user-profile">
        <img src="https://via.placeholder.com/40" alt="Profile" />
        <span>{user.firstname} {user.lastname}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;
