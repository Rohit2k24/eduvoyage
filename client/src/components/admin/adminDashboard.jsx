import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Modal, Button, Form, Table, ListGroup } from 'react-bootstrap';
import ApproveColleges from './ApproveColleges';
import CollegesList from './CollegesList';

const userGrowthData = [
  { name: 'Jan', users: 300 },
  { name: 'Feb', users: 500 },
  { name: 'Mar', users: 450 },
  { name: 'Apr', users: 600 },
  { name: 'May', users: 700 },
  { name: 'Jun', users: 650 },
  { name: 'Jul', users: 800 },
  { name: 'Aug', users: 900 },
];

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
  { name: 'Aug', revenue: 5000 },
];

const genderData = [
  { name: 'Male', value: 60 },
  { name: 'Female', value: 40 },
];

const COLORS = ['#0088FE', '#FF8042'];

const AdminDashboard = () => {
  const [roleCounts, setRoleCounts] = useState({
    studentCount: 0,
    collegeAdminCount: 0,
    sellerCount: 0,
    adminCount: 0,
    courseCount: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseData, setNewCourseData] = useState({
    courseName: '',
    courseDescription: '',
  });
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [unapprovedColleges, setUnapprovedColleges] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roleCounts, coursesData, recentActivityData] = await Promise.all([
          axios.get('http://localhost:5000/api/role-counts'),
          axios.get('http://localhost:5000/api/fetch-courses'),
          axios.get('http://localhost:5000/api/users')
        ]);

        console.log('Role Counts:', roleCounts.data);
        console.log('Courses Data:', coursesData.data);
        console.log('Recent Activity Data:', recentActivityData.data);

        setRoleCounts(prevCounts => ({
          ...prevCounts,
          ...roleCounts.data,
          courseCount: coursesData.data.length
        }));
        setCourses(coursesData.data);
        setRecentActivity(recentActivityData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleShowCollegeAdmin = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      const studentsData = response.data.filter(user => user.role === 'CollegeAdmin');
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setShowStudentModal(true);
  };

  const handleShowCoursesModal = () => {
    setShowCoursesModal(true);
  };

  const handleCloseStudentModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
    setShowEditModal(false);
    setEditFormData({});
  };

  const handleCloseCoursesModal = () => {
    setShowCoursesModal(false);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setEditFormData({
      firstname: student.firstname,
      lastname: student.lastname,
      email: student.email,
      address: student.address,
      phone: student.phone,
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/student-edit/${selectedStudent._id}`, editFormData);
      setStudents(students.map(student => (student._id === selectedStudent._id ? response.data : student)));
      alert('Student updated successfully');
      handleCloseStudentModal();
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student. Please try again.');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`http://localhost:5000/api/student-del/${id}`);
        setStudents(students.filter((student) => student._id !== id));
        alert('Student deleted successfully');
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student. Please try again.');
      }
    }
  };

  const handleShowAddCourseModal = () => {
    setShowAddCourseModal(true);
  };

  const handleCloseAddCourseModal = () => {
    setShowAddCourseModal(false);
    setNewCourseData({
      courseName: '',
      courseDescription: '',
    });
  };

  const handleAddCourseFormChange = (e) => {
    const { name, value } = e.target;
    setNewCourseData({
      ...newCourseData,
      [name]: value,
    });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!newCourseData.courseName || !newCourseData.courseDescription) {
      alert("Both fields are required.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/course-add', newCourseData);
      alert(response.data.message);
      handleCloseAddCourseModal();
      // Refresh courses
      const coursesData = await axios.get('http://localhost:5000/api/fetch-courses');
      setCourses(coursesData.data);
      setRoleCounts(prevCounts => ({
        ...prevCounts,
        courseCount: coursesData.data.length
      }));
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Failed to add course. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem("token");
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleShowApproveColleges = () => {
    setCurrentPage('approveColleges');
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
  };

  return (
    <div className="admin-dashboard">
      <div className="sidebar">
        <div className="sidebar-header">Admin Panel</div>
        <ul className="sidebar-menu">
          <li><a href="#" onClick={() => setCurrentPage('dashboard')}>Dashboard</a></li>
          <li><a href="#" onClick={() => setCurrentPage('colleges')}>List Colleges</a></li>
          <li><a href="#" onClick={handleShowApproveColleges}>Approve Colleges</a></li>
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
              <div className="admin-dashboard-card" onClick={handleShowCoursesModal}>
                <h3>Current Courses</h3>
                <p>{roleCounts.courseCount}</p>
              </div>
              <div className="admin-dashboard-card">
                <h3>Total Students</h3>
                <p>{roleCounts.studentCount}</p>
              </div>
              <div className="admin-dashboard-card" onClick={handleShowAddCourseModal}>
                <h3>Add New Course</h3>
                <p>+</p>
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

        {currentPage === 'approveColleges' && <ApproveColleges />}

        {currentPage === 'colleges' && <CollegesList />}

        {/* Students Modal */}
        <Modal show={showStudentModal} onHide={handleCloseStudentModal}>
          <Modal.Header closeButton>
            <Modal.Title>College Admins</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.firstname} {student.lastname}</td>
                    <td>{student.email}</td>
                    <td>
                      <Button variant="warning" onClick={() => handleEditStudent(student)}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDeleteStudent(student._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseStudentModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Courses Modal */}
        <Modal show={showCoursesModal} onHide={handleCloseCoursesModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Current Courses</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCoursesModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

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
                  name="courseName"
                  value={newCourseData.courseName}
                  onChange={handleAddCourseFormChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formCourseDescription">
                <Form.Label>Course Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter course description"
                  name="courseDescription"
                  value={newCourseData.courseDescription}
                  onChange={handleAddCourseFormChange}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Add Course
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAddCourseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
