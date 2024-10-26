import React from 'react';
import '../Sidebar/CollegeSidebar.css'; // Ensure this is your CSS for the sidebar
import CollegeSidebar from '../Sidebar/CollegeSidebar'; // Import CollegeSidebar


const ExamsAndCertifications = () => {
  return (
    <div className="college-admin-dashboard-container">
      <CollegeSidebar />
      <div className="content">
        <div className="dashboard-header">
          <h1>Exams and Certifications</h1>
        </div>
        <p>Manage exams and certifications for the courses.</p>
        {/* Add additional functionalities for managing exams and certifications here */}
      </div>
    </div>
  );
};

export default ExamsAndCertifications;
