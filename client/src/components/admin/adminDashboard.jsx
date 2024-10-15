import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Modal, Button, Form } from 'react-bootstrap';

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
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [students, setStudents] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchRoleCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/role-counts');
        setRoleCounts(response.data);
      } catch (error) {
        console.error('Error fetching role counts:', error);
      }
    };

    const fetchRecentActivity = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setRecentActivity(response.data);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      }
    };

    fetchRoleCounts();
    fetchRecentActivity();
  }, []);

  const handleShowStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      const studentsData = response.data.filter(user => user.role === 'Student');
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setShowStudentModal(true);
  };

  const handleCloseStudentModal = () => {
    setShowStudentModal(false);
    setSelectedStudent(null);
    setShowEditModal(false);
    setEditFormData({});
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

  // Logout function
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      // Redirect to login page or clear session
      window.location.href = '/'; // Adjust to your login route
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, Admin! Here's an overview of the latest metrics.</p>
        <Button variant="danger" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <div className="admin-dashboard-overview">
        <div className="admin-dashboard-card" onClick={handleShowStudents}>
          <h3>Total Students</h3>
          <p>{roleCounts.studentCount}</p>
        </div>
        <div className="admin-dashboard-card">
          <h3>Total College Admins</h3>
          <p>{roleCounts.collegeAdminCount}</p>
        </div>
        <div className="admin-dashboard-card">
          <h3>Total Admins</h3>
          <p>{roleCounts.adminCount}</p>
        </div>
      </div>

      <div className="admin-dashboard-charts-container">
        <div className="admin-dashboard-chart">
          <h2>User Growth (Last 8 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-dashboard-chart">
          <h2>Revenue Growth (Last 8 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-dashboard-chart">
          <h2>Student Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-dashboard-recent-activity">
        <h2>Recent Activity</h2>
        <table className="admin-dashboard-activity-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {recentActivity.map((user, index) => (
              <tr key={index}>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.address}</td>
                <td>{user.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showStudentModal} onHide={handleCloseStudentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Student List</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table className="table">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.firstname}</td>
                  <td>{student.lastname}</td>
                  <td>{student.email}</td>
                  <td>
                    <Button onClick={() => handleEditStudent(student)}>Edit</Button>
                    <Button variant="danger" onClick={() => handleDeleteStudent(student._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={handleCloseStudentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateStudent}>
            <Form.Group controlId="formFirstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstname"
                value={editFormData.firstname}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                value={editFormData.lastname}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={editFormData.address}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditFormChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Student
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
