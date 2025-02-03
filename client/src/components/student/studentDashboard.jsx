// src/components/student/StudentDashboard.jsx

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StudentSidebar from '../Sidebar/StudentSidebar';
import './studentDashboard.css';
import Header from './Header';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaGraduationCap, 
  FaBook, 
  FaClipboardList,
  FaCertificate,
  FaBars
} from 'react-icons/fa';

const dashboardItems = [
  {
    path: '/studentDashboard',
    icon: <FaHome className="card-icon" />,
    title: 'Dashboard',
    description: 'Overview of your academic progress',
    color: '#4f46e5'
  },
  {
    path: '/study-program',
    icon: <FaGraduationCap className="card-icon" />,
    title: 'Study Programs',
    description: 'Explore available study programs',
    color: '#0891b2'
  },
  {
    path: '/my-courses',
    icon: <FaBook className="card-icon" />,
    title: 'My Courses',
    description: 'Access your enrolled courses',
    color: '#2563eb'
  },
  {
    path: '/exams',
    icon: <FaClipboardList className="card-icon" />,
    title: 'Exams',
    description: 'View and manage your examinations',
    color: '#7c3aed'
  },
  {
    path: '/my-certificates',
    icon: <FaCertificate className="card-icon" />,
    title: 'My Certificates',
    description: 'Access your earned certificates',
    color: '#059669'
  }
];

const StudentDashboard = () => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    country: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const studentId = localStorage.getItem('studentId');
        const token = localStorage.getItem('token');
        
        if (!studentId || !token) {
          setErrorMessage('Authentication required');
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users`, {
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
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`);
      localStorage.removeItem("token");
      localStorage.removeItem('studentId');
      localStorage.removeItem("role");
    } catch (error) {
      console.error('Error logging out:', error);
      setErrorMessage('Logout failed. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Optional: Close sidebar when clicking outside
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="student-dashboard">
      <div className="menu-button" onClick={toggleSidebar}>
        <FaBars />
      </div>
      
      {/* Add overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={handleOverlayClick}
      />
      
      <StudentSidebar isOpen={isSidebarOpen} />
      
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <Header user={user} onLogout={handleLogout} />
        
        <div className="welcome-section">
          <h1>Welcome back, {user.firstname}!</h1>
          <p>Access all your educational resources from one place</p>
        </div>

        <div className="dashboard-grid">
          {dashboardItems.map((item) => (
            <Link to={item.path} key={item.path} className="dashboard-card-link">
              <div 
                className="dashboard-card" 
                style={{ borderTop: `4px solid ${item.color}` }}
              >
                <div className="card-icon-wrapper" style={{ color: item.color }}>
                  {item.icon}
                </div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-description">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>

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
