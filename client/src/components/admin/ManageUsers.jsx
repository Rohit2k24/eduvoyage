import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Dropdown, Modal, Form } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
import Swal from 'sweetalert2'; // Import Swal
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('All'); // Default to 'All'
  const [editUser, setEditUser] = useState(null); // To track which user is being edited
  const [showModal, setShowModal] = useState(false); // For modal display
  const [firstname, setFirstname] = useState(''); // Track edited firstname
  const [lastname, setLastname] = useState(''); // Track edited lastname
  const [email, setEmail] = useState(''); // Track edited email

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
        setFilteredUsers(response.data); // Set initial filtered users to all users
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem('token');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle role filter change
  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    if (role === 'All') {
      setFilteredUsers(users); // Show all users
    } else {
      const filtered = users.filter((user) => user.role === role);
      setFilteredUsers(filtered); // Show filtered users based on selected role
    }
  };

  // Open modal and populate form with current user data
  const handleEditUser = (user) => {
    setEditUser(user);
    setFirstname(user.firstname);
    setLastname(user.lastname);
    setEmail(user.email);
    setShowModal(true);
  };

  // Handle form submission for saving changes
  const handleSaveChanges = async () => {
    try {
      const updatedUser = { firstname, lastname, email };
      await axios.put(`http://localhost:5000/api/users/${editUser._id}`, updatedUser);

      // Update user in the list without re-fetching all users
      const updatedUserList = users.map((user) =>
        user._id === editUser._id ? { ...user, firstname, lastname, email } : user
      );
      setUsers(updatedUserList);
      setFilteredUsers(updatedUserList);
      setShowModal(false);

      // Display SweetAlert2 success notification
      Swal.fire({
        icon: 'success',
        title: 'User Details Updated',
        text: 'User details updated successfully!',
        timer: 2000, // Close automatically after 2 seconds
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error updating user:', error);

      // Display SweetAlert2 error notification
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error updating details. Please try again!',
      });
    }
  };

  return (
    <div className="layout">
      <Sidebar handleLogout={handleLogout} />
      <div className="container">
        <h1>Manage Users</h1>
        <div className="filter-container">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Filter by Role: {selectedRole}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleRoleFilter('All')}>All</Dropdown.Item>
              <Dropdown.Item onClick={() => handleRoleFilter('Admin')}>Admin</Dropdown.Item>
              <Dropdown.Item onClick={() => handleRoleFilter('Student')}>Student</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <Table striped bordered hover>
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Role</th>
      <th>Actions</th> {/* Column for Edit/Delete actions */}
    </tr>
  </thead>
  <tbody>
    {filteredUsers.map((user) => (
      <tr key={user._id}>
        <td>{user.firstname} {user.lastname}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
        <td>
          {user.role !== 'Admin' && (
            <>
              <Button className="editu" onClick={() => handleEditUser(user)}>Edit</Button>
            </>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</Table>

        {/* Modal for editing user details */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formFirstname">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formLastname">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ManageUsers;
