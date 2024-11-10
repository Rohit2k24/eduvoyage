import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import swal from 'sweetalert2';
import CollegeSidebar from '../Sidebar/CollegeSidebar';
import './ApplicationReceived.css';

const ApplicationRecieved = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(10);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`);
      localStorage.removeItem('token');
      localStorage.removeItem('collegeId');
      localStorage.removeItem('role');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchApplicationReceived = async () => {
    setLoading(true);
    setError(null);
    try {
      const collegeId = localStorage.getItem('collegeId');
      if (collegeId) {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/student-enroll-course/${collegeId}`);
        console.log(response.data.data)
        setApplications(response.data.data);
      } else {
        console.error("College ID not found in local storage");
      }
    } catch (error) {
      console.log("Error fetching applications received:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      await axios.put(`${import.meta.env.VITE_BASE_URL}/api/auth/approve-application/${applicationId}`, { status: "approved" });
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
        axios.put(`${import.meta.env.VITE_BASE_URL}/api/auth/reject-application/${applicationId}`, { status: "rejected" })
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
    let objectUrl = null;
    try {
      const formattedPath = filePath.replace(/^.*[\\\/]/, ''); // Clean path to use just the filename if needed
      console.log(formattedPath)
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/download/${formattedPath}`, {
        responseType: 'blob'
      });
  
      // Create a URL and trigger download
      objectUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', formattedPath.split('/').pop()); // Extract filename
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Cleanup
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      swal.fire({
        title: "Error",
        text: "Failed to download file. Please try again.",
        icon: "error"
      });
    }
  };
  
  useEffect(() => {
    fetchApplicationReceived();
  }, []);

  // Add search and filter functionality
  const filteredApplications = applications.filter(app => 
    app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastApplication = currentPage * applicationsPerPage;
  const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
  const currentApplications = filteredApplications.slice(indexOfFirstApplication, indexOfLastApplication);
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);

  return (
    <div className="applications-container">
      <CollegeSidebar handleLogout={handleLogout} />
      <div className="applications-content">
        <div className="applications-header">
          <h1 className="applications-title">Applications Received</h1>
          <input
            type="text"
            className="search-input"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading && <div>Loading applications...</div>}
        {error && <div style={{color: 'red'}}>{error}</div>}
        
        {!loading && !error && (
          <>
            <div className="applications-table-container">
              <table className="applications-table">
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
                  {currentApplications.map((application) => (
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
                          <button 
                            onClick={() => handleFileDownload(application.percentageFilePath)} 
                            className="file-button"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                              <polyline points="13 2 13 9 20 9"></polyline>
                            </svg>
                            View
                          </button>
                        )}
                      </td>
                      <td>{application.studyMode || 'N/A'}</td>
                      <td>{application.status}</td>
                      <td>
                        {application.status === "pending" ? (
                          <div className="action-buttons-container">
                            <button 
                              onClick={() => handleApprove(application._id)} 
                              className="action-button approve-button"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleReject(application._id)} 
                              className="action-button reject-button"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`status-${application.status.toLowerCase()}`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    margin: '0 5px',
                    padding: '5px 10px',
                    backgroundColor: currentPage === i + 1 ? '#007bff' : '#fff',
                    color: currentPage === i + 1 ? '#fff' : '#007bff',
                    border: '1px solid #007bff',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationRecieved;
