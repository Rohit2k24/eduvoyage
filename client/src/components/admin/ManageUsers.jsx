import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Dropdown, Modal, Form } from 'react-bootstrap';
import Sidebar from '../Sidebar/Sidebar';
import Swal from 'sweetalert2';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState('All');
  const [editUser, setEditUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users`);
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`);
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    if (role === 'All') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) => user.role === role);
      setFilteredUsers(filtered);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setFirstname(user.firstname);
    setLastname(user.lastname);
    setEmail(user.email);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedUser = { firstname, lastname, email };
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/users/${editUser._id}`, updatedUser);

      const updatedUserList = users.map((user) =>
        user._id === editUser._id ? { ...user, firstname, lastname, email } : user
      );
      setUsers(updatedUserList);
      setFilteredUsers(updatedUserList);
      setShowModal(false);

      Swal.fire({
        icon: 'success',
        title: 'User Details Updated',
        text: 'User details updated successfully!',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error updating user:', error);
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
      <div className="container manage-users">
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
              <th>Actions</th>
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
                    <Button className="editu" onClick={() => handleEditUser(user)}>Edit</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal for editing user details */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          centered
          style={{ zIndex: 1050 }}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onClick={(e) => e.stopPropagation()}>
              <Form.Group controlId="formFirstname" className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  autoFocus
                />
              </Form.Group>

              <Form.Group controlId="formLastname" className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formEmail" className="mb-3">
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
            <Button 
              variant="secondary" 
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(false);
              }}
            >
              Close
            </Button>
            <Button 
              variant="primary" 
              onClick={(e) => {
                e.stopPropagation();
                handleSaveChanges();
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ManageUsers;
