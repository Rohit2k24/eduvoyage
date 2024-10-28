import React, { useState, useEffect } from 'react';
import './CollegeAdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import CollegeSidebar from '../Sidebar/CollegeSidebar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirect

const CollegeAdminDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate

  // State for dashboard data and offered courses
  const [dashboardData, setDashboardData] = useState({
    studentCount: 150,
    courseCount: 0,
    revenue: 50000,
  });
  const [offeredCourses, setOfferedCourses] = useState([]);

  // Fetch offered courses and update course count
  useEffect(() => {
    const fetchOfferedCourses = async () => {
      try {
        const collegeId = localStorage.getItem('collegeId');
        const response = await axios.get(`http://localhost:5000/api/offered-courses/${collegeId}`);
        setOfferedCourses(response.data);
        
        // Update the course count in dashboardData
        setDashboardData(prevData => ({
          ...prevData,
          courseCount: response.data.length
        }));
      } catch (error) {
        console.error('Error fetching offered courses:', error);
      }
    };

    fetchOfferedCourses();
  }, []);

  // Logout handler
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
          <h1>College Admin Dashboard</h1>
        </div>

        <div className="dashboard-overview">
          <div className="dashboard-card">
            <h3>Total Students Enrolled</h3>
            <p>{dashboardData.studentCount}</p>
          </div>
          <div className="dashboard-card">
            <h3>Courses Offered</h3>
            <p>{dashboardData.courseCount}</p>
          </div>
          <div className="dashboard-card">
            <h3>Total Revenue</h3>
            <p>${dashboardData.revenue}</p>
          </div>
        </div>

        <div className="courses-offered">
          <h2>Offered Courses</h2>
          {offeredCourses.length > 0 ? (
            <ul>
              {offeredCourses.map(course => (
                <li key={course.id}>
                  <h3>{course.courseName}</h3>
                  <p>{course.courseDescription}</p>
                  <p>Duration: {course.duration}</p>
                  <p>Price: ${course.price}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses offered.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeAdminDashboard;
