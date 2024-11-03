import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert2';
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
        console.log(response.data.data)
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
      swal.fire({
        title: "Application Approved",
        text: "The application has been successfully approved!",
        icon: "success",
        confirmButtonText: "OK"
      });
      fetchApplicationReceived();
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (applicationId) => {
    swal.fire({
      title: "Are you sure?",
      text: "This action will deny the application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Deny",
      cancelButtonText: "Cancel",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`http://localhost:5000/api/auth/reject-application/${applicationId}`, { status: "rejected" })
          .then(() => {
            swal.fire({
              title: "Application Denied",
              text: "The application has been denied.",
              icon: "error",
              confirmButtonText: "OK"
            });
            fetchApplicationReceived();
          })
          .catch((error) => {
            console.error("Error rejecting application:", error);
          });
      }
    });
  };

  const handleFileDownload = async (filePath) => {
    try {
      const formattedPath = filePath.replace(/^.*[\\\/]/, ''); // Clean path to use just the filename if needed
      console.log(formattedPath)
      const response = await axios.get(`http://localhost:5000/api/auth/download/${formattedPath}`, {
        responseType: 'blob'
      });
  
      // Create a URL and trigger download
      const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', formattedPath.split('/').pop()); // Extract filename
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
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
      <th>Date of Birth</th>
      <th>Gender</th>
      <th>Nationality</th>
      <th>Passport Number</th>
      <th>Highest Qualification</th>
      <th>Degree Name</th>
      <th>Institution</th>
      <th>Year of Completion</th>
      <th>GPA</th>
      <th>File</th>
      <th>Study Mode</th>
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
        <td>{application.dateOfBirth ? new Date(application.dateOfBirth).toISOString().split('T')[0] : 'N/A'}</td>
        <td>{application.gender || 'N/A'}</td>
        <td>{application.nationality || 'N/A'}</td>
        <td>{application.passportnumber || 'N/A'}</td>
        <td>{application.previousEducation?.highestQualification || 'N/A'}</td>
        <td>{application.previousEducation?.degreeName || 'N/A'}</td>
        <td>{application.previousEducation?.institution || 'N/A'}</td>
        <td>{application.previousEducation?.yearOfCompletion || 'N/A'}</td>
        <td>{application.previousEducation?.gpa || 'N/A'}</td>
        <td>
          {application.percentageFilePath && (
            <>
              <button onClick={() => handleFileDownload(application.percentageFilePath)} className="approve-btn">File</button>
            </>
          ) }
        </td>
        <td>{application.studyMode || 'N/A'}</td>
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
