import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentSidebar from '../Sidebar/StudentSidebar';

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const studentId = localStorage.getItem('studentId');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/student/certificates/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setCertificates(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setLoading(false);
    }
  };

  const downloadCertificate = async (certificateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/exam/certificate/${certificateId}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/pdf'
          }
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  const styles = {
    container: {
      flex: 1,
      padding: '2rem',
      marginLeft: '250px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      boxSizing: 'border-box'
    },
    header: {
      color: '#2c3e50',
      marginBottom: '2rem',
      fontSize: '2.2rem',
      borderBottom: '2px solid #3498db',
      paddingBottom: '0.5rem'
    },
    certificateGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      padding: '1rem 0'
    },
    certificateCard: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease',
      border: '1px solid #e1e8ed'
    },
    courseTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#2c3e50'
    },
    certificateInfo: {
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '1rem'
    },
    downloadButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '0.8rem 1.5rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      width: '100%',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: '#2980b9'
      }
    },
    score: {
      fontSize: '1.1rem',
      fontWeight: '500',
      color: '#27ae60',
      marginBottom: '1rem'
    },
    loadingText: {
      textAlign: 'center',
      fontSize: '1.2rem',
      color: '#666'
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <StudentSidebar />
      <div style={styles.container}>
        <h1 style={styles.header}>My Certificates</h1>
        
        {loading ? (
          <p style={styles.loadingText}>Loading certificates...</p>
        ) : certificates.length > 0 ? (
          <div style={styles.certificateGrid}>
            {certificates.map(cert => (
              <div key={cert._id} style={styles.certificateCard}>
                <h3 style={styles.courseTitle}>{cert.courseId.courseName}</h3>
                <div style={styles.certificateInfo}>
                  <p>College: {cert.collegeId.collegeName}</p>
                  <p>Date: {new Date(cert.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={styles.score}>Score: {cert.examScore}%</div>
                <button
                  onClick={() => downloadCertificate(cert._id)}
                  style={styles.downloadButton}
                >
                  Download Certificate
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.loadingText}>No certificates found.</p>
        )}
      </div>
    </div>
  );
};

export default MyCertificates; 