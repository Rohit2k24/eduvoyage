import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ handleLogout}) => {
  const navigate = useNavigate();

  const handleLogoutAndRedirect = async () => {
    try {
      await handleLogout(); // Call the handleLogout to perform logout logic
      localStorage.removeItem('token');
      navigate('/login');   // Redirect to login page after logout
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">Admin Panel</div>
      <ul className="sidebar-menu">
        <li><Link to="/adminDashboard">Dashboard</Link></li>
        <li><Link to="/admin/colleges">List Colleges</Link></li>
        <li><Link to="/admin/approve-colleges">Approve Colleges</Link></li>
        <li><Link to="/admin/manage-courses">Manage Courses</Link></li>
        <li><Link to="/admin/manage-users">Manage Users</Link></li>
        <li><Link to="/admin/reports">Reports</Link></li>
        <li><a href="#" onClick={handleLogoutAndRedirect}>Logout</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
