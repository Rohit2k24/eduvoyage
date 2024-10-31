import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CollegeSidebar from '../Sidebar/CollegeSidebar';
import './ApplicationReceived.css';

const ApplicationRecieved = () => {
  const [applications, setApplications] = useState([]);
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

  const fetchApplicationReceived = async () => {
    try {
      const collegeId = localStorage.getItem('collegeId');
      if (collegeId) {
        const response = await axios.get(`http://localhost:5000/api/auth/student-enroll-course/${collegeId}`);
        setApplications(response.data.data);
      } else {
        console.error("College ID not found in local storage");
      }
    } catch (error) {
      console.log("Error fetching applications received:", error);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/approve-application/${applicationId}`, { status: "approved" });
      fetchApplicationReceived()
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/reject-application/${applicationId}`, { status: "rejected" });
      fetchApplicationReceived()
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  useEffect(() => {
    fetchApplicationReceived();
  }, []);

  return (
    <div className="college-admin-dashboard-container">
      <CollegeSidebar handleLogout={handleLogout} />
      <div className="content">
        <div className="dashboard-header">
          <h1>Applications Received</h1>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application._id}>
                <td>{application.fullName}</td>
                <td>{application.email}</td>
                <td>{application.phone}</td>
                <td>{application.previousEducation?.highestQualification || 'N/A'}</td>
                <td>{application.previousEducation?.gpa || 'N/A'}</td>
                <td>{application.status}</td>
                <td>
                  {application.status === "pending" ? (
                    <>
                      <button onClick={() => handleApprove(application._id)} className="approve-btn">Approve</button>
                      <button onClick={() => handleReject(application._id)} className="reject-btn">Reject</button>
                    </>
                  ) : (
                    <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationRecieved;
