import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Add this import
import '../Sidebar/CollegeSidebar.css'; // Ensure this is your CSS for the sidebar
import CollegeSidebar from '../Sidebar/CollegeSidebar'; // Import CollegeSidebar


const ExamsAndCertifications = () => {
  const navigate = useNavigate(); 

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`);
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
          <h1>Exams and Certifications</h1>
        </div>
        <p>Manage exams and certifications for the courses.</p>
        {/* Add additional functionalities for managing exams and certifications here */}
      </div>
    </div>
  );
};

export default ExamsAndCertifications;
