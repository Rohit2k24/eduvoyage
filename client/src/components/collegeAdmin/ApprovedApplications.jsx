import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CollegeSidebar from '../Sidebar/CollegeSidebar';
import './ApprovedApplications.css';

const ApprovedApplications = () => {
  const [approvedApplications, setApprovedApplications] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('collegeId');
      localStorage.removeItem('role');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchApprovedApplications = async () => {
    try {
      const collegeId = localStorage.getItem('collegeId');
      if (collegeId) {
        const response = await axios.get(`http://localhost:5000/api/auth/student-enroll-course/${collegeId}`);
        
        // Filter for approved applications
        const approvedApps = response.data.data.filter(application => application.status === "approved");
        setApprovedApplications(approvedApps);
      } else {
        console.error("College ID not found in local storage");
      }
    } catch (error) {
      console.error("Error fetching approved applications:", error);
    }
  };

  useEffect(() => {
    fetchApprovedApplications();
  }, []);

  return (
    <div className="college-admin-dashboard-container">
      <CollegeSidebar handleLogout={handleLogout} />
      <div className="content">
        <div className="dashboard-header">
          <h1>Approved Applications</h1>
        </div>
        <table className="application-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Highest Qualification</th>
              <th>GPA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {approvedApplications.map((application) => (
              <tr key={application._id}>
                <td>{application.fullName}</td>
                <td>{application.email}</td>
                <td>{application.phone}</td>
                <td>{application.previousEducation?.highestQualification || 'N/A'}</td>
                <td>{application.previousEducation?.gpa || 'N/A'}</td>
                <td>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedApplications;
