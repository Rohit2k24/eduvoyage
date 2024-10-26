import React from 'react';
import '../Sidebar/CollegeSidebar.css'; // Ensure this is your CSS for the sidebar
import CollegeSidebar from '../Sidebar/CollegeSidebar'; // Import CollegeSidebar

const PublicQueries = () => {
  return (
    <div className="college-admin-dashboard-container">
      <CollegeSidebar />
      <div className="content">
        <div className="dashboard-header">
          <h1>Public Queries and Open Discussions</h1>
        </div>
        <p>Engage in discussions and answer public queries.</p>
        {/* Add additional functionalities for managing public queries and discussions here */}
      </div>
    </div>
  );
};

export default PublicQueries;
