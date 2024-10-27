import React from 'react';
import axios from 'axios'; 
import { useNavigate } from "react-router-dom";
import CollegeSidebar from '../Sidebar/CollegeSidebar'; // Import CollegeSidebar


const ApplicationRecieved = () => {
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
          <h1>Applications Recieved</h1>
        </div>
        <p>Manage Applications Recieved for the courses.</p>
        {/* Add additional functionalities for managing exams and certifications here */}
      </div>
    </div>
  );
};

export default ApplicationRecieved;