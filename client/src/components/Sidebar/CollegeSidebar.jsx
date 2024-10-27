import React from 'react';
import { Link } from 'react-router-dom';
import './CollegeSidebar.css'; // Assuming you have a CSS file for styling

const CollegeSidebar = ({ handleLogout }) => { // Accept handleLogout as a prop
  return (
    <div className="college-sidebar">
      <h2>College Admin</h2>
      <ul>
        <li>
          <Link to="/collegeadminDashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/course-offered">Courses Offered</Link>
        </li>
        <li>
          <Link to="/application-recieved">Applications Received</Link>
        </li>
        <li>
          <Link to="/exams-certifications">Exams and Certifications</Link>
        </li>
        <li>
          <Link to="/public-queries">Public Queries and Open Discussions</Link>
        </li>
        <li>
          <a href="#" onClick={handleLogout}>Logout</a> {/* Call handleLogout directly */}
        </li>
      </ul>
    </div>
  );
};

export default CollegeSidebar;
