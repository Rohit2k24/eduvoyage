import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import './header.css';

const SharedHeader = ({ user, onLogout, title, subtitle }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="dashboard-header-wrapper">
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
      
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default SharedHeader; 