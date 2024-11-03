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
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Nationality</th>
              <th>Passport Number</th>
              <th>Highest Qualification</th>
              <th>Degree Name</th>
              <th>Institution</th>
              <th>Year of Completion</th>
              <th>GPA</th>
              <th>Study Mode</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {approvedApplications.map((application) => (
              <tr key={application._id}>
                <td>{application.fullName}</td>
                <td>{application.email}</td>
                <td>{application.phone}</td>
                <td>{application.dateOfBirth ? new Date(application.dateOfBirth).toISOString().split('T')[0] : 'N/A'}</td>
                <td>{application.gender || 'N/A'}</td>
                <td>{application.nationality || 'N/A'}</td>
                <td>{application.passportnumber || 'N/A'}</td>
                <td>{application.previousEducation?.highestQualification || 'N/A'}</td>
                <td>{application.previousEducation?.degreeName || 'N/A'}</td>
                <td>{application.previousEducation?.institution || 'N/A'}</td>
                <td>{application.previousEducation?.yearOfCompletion || 'N/A'}</td>
                <td>{application.previousEducation?.gpa || 'N/A'}</td>
                <td>{application.studyMode || 'N/A'}</td>
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
