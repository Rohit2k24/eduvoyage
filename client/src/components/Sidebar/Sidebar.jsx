// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ handleLogout, setCurrentPage }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">Admin Panel</div>
      <ul className="sidebar-menu">
        <li><Link to="/adminDashboard">Dashboard</Link></li>
        <li><Link to="/admin/colleges">List Colleges</Link></li>
        <li><Link to="/admin/approve-colleges">Approve Colleges</Link></li>
        <li><Link to="/admin/manage-courses">Manage Courses</Link></li>
        <li><a href="#" onClick={() => setCurrentPage('users')}>Manage Users</a></li>
        <li><Link to="/admin/reports">Reports</Link></li>
        <li><a href="#" onClick={handleLogout}>Logout</a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
