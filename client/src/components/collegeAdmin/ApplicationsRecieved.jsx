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
    setLoading(true);
    setError(null);
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
    } finally {
      setLoading(false);
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
    let objectUrl = null;
    try {
      const formattedPath = filePath.replace(/^.*[\\\/]/, ''); // Clean path to use just the filename if needed
      console.log(formattedPath)
      const response = await axios.get(`http://localhost:5000/api/auth/download/${formattedPath}`, {
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
    <div className="college-admin-dashboard-container">
      <CollegeSidebar handleLogout={handleLogout} />
      <div className="content">
        <div className="dashboard-header">
          <h1>Applications Received</h1>
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              marginLeft: '20px',
              padding: '12px 20px',
              margin: '20px 0',
              width: '300px',
              borderRadius: '25px',
              border: '2px solid #e0e0e0',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              backgroundColor: '#ffffff',
              color: '#333333',
              '&::placeholder': {
                color: '#999999'
              },
              '&:focus': {
                borderColor: '#007bff',
                boxShadow: '0 2px 8px rgba(0,123,255,0.25)'
              },
              position: 'relative',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23999' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '15px center',
              paddingLeft: '45px'
            }}
          />
        </div>
        
        {loading && <div>Loading applications...</div>}
        {error && <div style={{color: 'red'}}>{error}</div>}
        
        {!loading && !error && (
          <>
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
