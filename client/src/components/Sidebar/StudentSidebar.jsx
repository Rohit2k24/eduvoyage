// src/components/student/StudentSidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './studentSidebar.css';

const StudentSidebar = ({ activeTab, setActiveTab }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="student-sidebar">
      <h2>Eduvoyage</h2>
      <ul>
        <li className={isActive('/studentDashboard') ? 'active' : ''}>
          <Link to="/studentDashboard">Dashboard</Link>
        </li>
        <li className={isActive('/study-program') ? 'active' : ''}>
          <Link to="/study-program">Study Programs</Link>
        </li>
        <li className={isActive('/my-courses') ? 'active' : ''}>
          <Link to="/my-courses">My Courses</Link>
        </li>
        {/* <li className={isActive('/resources') ? 'active' : ''}>
          <Link to="/resources">Resources</Link>
        </li> */}
        {/* <li className={isActive('/tasks') ? 'active' : ''}>
          <Link to="/tasks">Tasks</Link>
        </li> */}
        <li className={isActive('/exams') ? 'active' : ''}>
          <Link to="/exams">Exams</Link>
        </li>
        {/* <li className={isActive('/analytics') ? 'active' : ''}>
          <Link to="/analytics">Analytics</Link>
        </li> */}
        {/* <li className={isActive('/groups') ? 'active' : ''}>
          <Link to="/groups">Groups</Link>
        </li> */}
        {/* <li className={isActive('/messages') ? 'active' : ''}>
          <Link to="/messages">Messages</Link>
        </li> */}
        <li className={isActive('/my-certificates') ? 'active' : ''}>
          <Link to="/my-certificates">My Certificates</Link>
        </li>
      </ul>
    </aside>
  );
};

export default StudentSidebar;
