// src/components/student/StudentDashboard.jsx

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentSidebar from '../Sidebar/StudentSidebar';
import './studentDashboard.css';
import Header from './Header';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import Resources from './Resources';
import Tasks from './Tasks';
import Exams from './Exams';
import Analytics from './Analytics';
import Groups from './Groups';
import Messages from './Messages';

const StudentDashboard = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    country: ''
  });
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const studentId = localStorage.getItem('studentId');
        const token = localStorage.getItem('token');
        
        if (!studentId || !token) {
          setErrorMessage('Authentication required');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const currentStudent = response.data.find(student => student._id === studentId);
        
        if (currentStudent) {
          const { firstname, lastname, email, phone, address, country } = currentStudent;
          setUser({ firstname, lastname, email, phone, address, country });
        } else {
          setErrorMessage('Student data not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Failed to load user data');
      }
    };

    fetchUserData();
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

  const UserProfileCard = () => (
    <div className="user-profile-card">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.firstname.charAt(0)}{user.lastname.charAt(0)}
        </div>
        <h2>{user.firstname} {user.lastname}</h2>
      </div>
      <div className="profile-info">
        <div className="info-item">
          <span className="info-label">Email:</span>
          <span className="info-value">{user.email}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Phone:</span>
          <span className="info-value">{user.phone || 'Not provided'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Address:</span>
          <span className="info-value">{user.address || 'Not provided'}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Country:</span>
          <span className="info-value">{user.country || 'Not provided'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="student-dashboard">
      <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-container">
        <Header user={user} onLogout={handleLogout} />
        <div className="main-content">
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <Routes>
            <Route path="/" element={
              <div className="dashboard-welcome">
                <h2>Welcome to Your Dashboard!</h2>
                <UserProfileCard />
              </div>
            } />
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
