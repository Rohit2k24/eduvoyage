import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import ApproveColleges from './ApproveColleges';
import CollegesList from './CollegesList';

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

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleShowAddCourseModal = () => setShowAddCourseModal(true);
  const handleCloseAddCourseModal = () => setShowAddCourseModal(false);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const newCourse = {
      courseName: newCourseName,
      courseDescription: newCourseDescription,
    };

    try {
      await axios.post('http://localhost:5000/api/course-add', newCourse);
      // Refresh course list after adding the course
      const coursesData = await axios.get('http://localhost:5000/api/fetch-courses');
      setCourses(coursesData.data);
      handleCloseAddCourseModal(); // Close the modal after success
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">Admin Panel</div>
        <ul className="sidebar-menu">
          <li><a href="#" onClick={() => setCurrentPage('dashboard')}>Dashboard</a></li>
          <li><a href="#" onClick={() => setCurrentPage('colleges')}>List Colleges</a></li>
          <li><a href="#" onClick={() => setCurrentPage('approveColleges')}>Approve Colleges</a></li>
          <li><a href="#" onClick={() => setCurrentPage('courses')}>Manage Courses</a></li>
          <li><a href="#" onClick={() => setCurrentPage('users')}>Manage Users</a></li>
          <li><a href="#" onClick={() => setCurrentPage('reports')}>Reports</a></li>
          <li><a href="#" onClick={handleLogout}>Logout</a></li>
        </ul>
      </div>
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
            {/* Recent Activity Table */}
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

        {currentPage === 'courses' && (
          <div className="manage-courses-section">
            <h2>Manage Courses</h2>
            <Button className="addc" variant="primary" onClick={handleShowAddCourseModal}>
              Add Course
            </Button>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course._id}>
                      <td>{course.courseName}</td>
                      <td>{course.courseDescription}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">No courses available</td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Add Course Modal */}
            <Modal show={showAddCourseModal} onHide={handleCloseAddCourseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Add New Course</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleAddCourse}>
                  <Form.Group controlId="formCourseName">
                    <Form.Label>Course Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter course name"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formCourseDescription">
                    <Form.Label>Course Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter course description"
                      value={newCourseDescription}
                      onChange={(e) => setNewCourseDescription(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Add Course
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </div>
        )}

        {currentPage === 'approveColleges' && <ApproveColleges />}
        {currentPage === 'colleges' && <CollegesList />}
      </div>
    </div>
  );
};

export default AdminDashboard;
