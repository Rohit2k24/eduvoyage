// src/components/student/StudentSidebar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './studentSidebar.css';

const StudentSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <h2>Eduvoyage</h2>
      <ul>
        <li className={activeTab === 'Dashboard' ? 'active' : ''}>
          <Link to="/studentDashboard" onClick={() => setActiveTab('Dashboard')}>Dashboard</Link>
        </li>
        <li className={activeTab === 'Study Programs' ? 'active' : ''}>
          <Link to="/study-program" onClick={() => setActiveTab('Study Programs')}>Study Programs</Link>
        </li>
        <li className={activeTab === 'Resources' ? 'active' : ''}>
          <Link to="/resources" onClick={() => setActiveTab('Resources')}>Resources</Link>
        </li>
        <li className={activeTab === 'Tasks' ? 'active' : ''}>
          <Link to="/tasks" onClick={() => setActiveTab('Tasks')}>Tasks</Link>
        </li>
        <li className={activeTab === 'Exams' ? 'active' : ''}>
          <Link to="/exams" onClick={() => setActiveTab('Exams')}>Exams</Link>
        </li>
        <li className={activeTab === 'Analytics' ? 'active' : ''}>
          <Link to="/analytics" onClick={() => setActiveTab('Analytics')}>Analytics</Link>
        </li>
        <li className={activeTab === 'Groups' ? 'active' : ''}>
          <Link to="/groups" onClick={() => setActiveTab('Groups')}>Groups</Link>
        </li>
        <li className={activeTab === 'Messages' ? 'active' : ''}>
          <Link to="/messages" onClick={() => setActiveTab('Messages')}>Messages</Link>
        </li>
      </ul>
    </aside>
  );
};

export default StudentSidebar;
