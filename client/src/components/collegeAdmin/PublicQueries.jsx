import React from 'react';
import axios from 'axios'; 
import { useNavigate } from "react-router-dom";
import '../Sidebar/CollegeSidebar.css'; // Ensure this is your CSS for the sidebar
import CollegeSidebar from '../Sidebar/CollegeSidebar'; // Import CollegeSidebar

const PublicQueries = () => {
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('collegeId');
      localStorage.removeItem('role');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <div className="college-admin-dashboard-container">
      <CollegeSidebar handleLogout={handleLogout} />
      <div className="content">
        <div className="dashboard-header">
          <h1>Public Queries and Open Discussions</h1>
        </div>
        <p>Engage in discussions and answer public queries.</p>
        {/* Add additional functionalities for managing public queries and discussions here */}
      </div>
    </div>
  );
};

export default PublicQueries;
