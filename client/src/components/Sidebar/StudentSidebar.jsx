// src/components/student/StudentSidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './studentSidebar.css';
import { 
  FaHome, 
  FaGraduationCap, 
  FaBook, 
  FaClipboardList,
  FaCertificate
} from 'react-icons/fa';

const sidebarItems = [
  {
    path: '/studentDashboard',
    icon: <FaHome />,
    title: 'Dashboard'
  },
  {
    path: '/study-program',
    icon: <FaGraduationCap />,
    title: 'Study Programs'
  },
  {
    path: '/my-courses',
    icon: <FaBook />,
    title: 'My Courses'
  },
  {
    path: '/exams',
    icon: <FaClipboardList />,
    title: 'Exams'
  },
  {
    path: '/my-certificates',
    icon: <FaCertificate />,
    title: 'My Certificates'
  }
];

const StudentSidebar = ({ isOpen }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`student-sidebar ${isOpen ? 'open' : ''}`}>
      <h2>EduVoyage</h2>
      <ul>
        {sidebarItems.map((item) => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={isActive(item.path) ? 'active' : ''}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default StudentSidebar;
