// src/components/student/StudentDashboard.jsx

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentSidebar from '../Sidebar/StudentSidebar';
import './studentDashboard.css';
import Header from './Header';
import axios from 'axios';
import { Routes, Route, Outlet } from 'react-router-dom';
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
    address: '',
    country: ''
  });
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
          const { firstname, lastname, email, address, country } = currentStudent;
          setUser({ firstname, lastname, email, address, country });
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
      <StudentSidebar />
      <div className="main-content">
        <Header user={user} onLogout={handleLogout} />
        <UserProfileCard />
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
