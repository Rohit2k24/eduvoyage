import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'; 
import Sidebar from '../Sidebar/Sidebar';

const AdminDashboard = () => {
  const [roleCounts, setRoleCounts] = useState({
    studentCount: 0,
    collegeAdminCount: 0,
    courseCount: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');

  const navigate = useNavigate();

  // Fetch data for dashboard
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roleCounts, coursesData, recentActivityData] = await Promise.all([
          axios.get('http://localhost:5000/api/role-counts'),
          axios.get('http://localhost:5000/api/fetch-courses'),
          axios.get('http://localhost:5000/api/users'),
        ]);

        setRoleCounts((prevCounts) => ({
          ...prevCounts,
          ...roleCounts.data,
          courseCount: coursesData.data.length,
        }));
        setCourses(coursesData.data);
        setRecentActivity(recentActivityData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Handle logout function
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem('token');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle showing and closing modal for adding a course
  const handleShowAddCourseModal = () => setShowAddCourseModal(true);
  const handleCloseAddCourseModal = () => setShowAddCourseModal(false);

  // Add new course logic
  const handleAddCourse = async (e) => {
    e.preventDefault();
    const newCourse = {
      courseName: newCourseName,
      courseDescription: newCourseDescription,
    };

    try {
      await axios.post('http://localhost:5000/api/course-add', newCourse);
      const coursesData = await axios.get('http://localhost:5000/api/fetch-courses');
      setCourses(coursesData.data);
      handleCloseAddCourseModal(); 
      Swal.fire({
        title: 'Success!',
        text: 'Course Added Successfully',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar handleLogout={handleLogout}/>
      <div className="main-content">
        {currentPage === 'dashboard' && (
          <>
            <div className="admin-dashboard-header">
              <h1>Admin Dashboard</h1>
              <p>Welcome back, Admin! Here's an overview of the latest metrics.</p>
            </div>
            <div className="admin-dashboard-overview">
              <div className="admin-dashboard-card">
                <h3>Total Students</h3>
                <p>{roleCounts.studentCount}</p>
              </div>
              <div className="admin-dashboard-card">
                <h3>Current Courses</h3>
                <p>{roleCounts.courseCount}</p>
              </div>
            </div>
            <div className="admin-dashboard-recent-activity">
              <h2>Recent Activity</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.firstname} {activity.lastname}</td>
                      <td>{activity.role} registered</td>
                      <td>{new Date(activity.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
