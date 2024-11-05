// src/components/student/StudentDashboard.jsx

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentSidebar from '../Sidebar/StudentSidebar';
import './studentDashboard.css'; // Make sure this import is here
import Header from './Header'; // Import the Header component
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import Resources from './Resources';
import Tasks from './Tasks';
import Exams from './Exams';
import Analytics from './Analytics';
import Groups from './Groups';
import Messages from './Messages';

const StudentDashboard = () => {
  const [user, setUser] = useState({ firstname: '', lastname: '' });
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch user data here and set it
    // Example: setUser({ firstname: 'John', lastname: 'Doe' });
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem("token");
      localStorage.removeItem('studentId');
      localStorage.removeItem("role");
    } catch (error) {
      console.error('Error logging out:', error);
      setErrorMessage('Logout failed. Please try again.');
    }
  };

  return (
    <div className="student-dashboard">
      <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-container">
        <Header user={user} onLogout={handleLogout} />
        <div className="main-content">
          {/* Error Message Display */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Dashboard Content */}
          <Routes>
            <Route path="/" element={<h2>Welcome to Your Dashboard!</h2>} />
            <Route path="/study-program" element={<h2>Study Programs</h2>} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/exams" element={<Exams />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
