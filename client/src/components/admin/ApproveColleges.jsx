import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Image } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { FaDownload } from 'react-icons/fa';

const ApproveColleges = () => {
  const [unapprovedColleges, setUnapprovedColleges] = useState([]);
  console.log(unapprovedColleges);

  useEffect(() => {
    fetchUnapprovedColleges();
  }, []);

  const fetchUnapprovedColleges = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/unapproved-colleges');
      setUnapprovedColleges(response.data);
    } catch (error) {
      console.error('Error fetching unapproved colleges:', error);
    }
  };

  const handleApproveCollege = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/approve-college/${id}`);
      fetchUnapprovedColleges(); 
      Swal.fire("success","College approved successfully","success");
    } catch (error) {
      console.error('Error approving college:', error);
      Swal.fire("error","Failed to approve college. Please try again.","error");    }
  };

  const styles = {
    container: {
      backgroundColor: '#f8f9fa',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      color: '#2c3e50',
      marginBottom: '2rem',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    card: {
      height: '100%',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s',
      ':hover': {
        transform: 'translateY(-5px)',
      },
    },
    cardTitle: {
      color: '#3498db',
      fontWeight: 'bold',
      marginBottom: '1rem',
    },
    cardText: {
      fontSize: '0.9rem',
      color: '#34495e',
    },
    imageContainer: {
      marginTop: '1rem',
      marginBottom: '1rem',
    },
    imageTitle: {
      color: '#2c3e50',
      marginBottom: '0.5rem',
    },
    image: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '5px'
    },
    approveButton: {
      backgroundColor: '#2ecc71',
      border: 'none',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#27ae60',
      },
    },
  };

  return (
    <Container style={styles.container}>
      <h2 style={styles.header}>Approve Colleges</h2>
      {unapprovedColleges.length > 0 ? (
        <Row>
          {unapprovedColleges.map((college) => (
            <Col key={college._id} md={6} lg={4} className="mb-4">
              <Card style={styles.card}>
                <Card.Body>
                  <Card.Title style={styles.cardTitle}>{college.collegeName}</Card.Title>
                  <Card.Text style={styles.cardText}>
                    <strong>Email:</strong> {college.email || 'N/A'}<br />
                    <strong>Address:</strong> {college.address || 'N/A'}<br />
                    <strong>Country:</strong> {college.country || 'N/A'}<br />
                    <strong>Contact Person:</strong> {college.contactPerson || 'N/A'}<br />
                    <strong>Phone Number:</strong> {college.phoneNumber || 'N/A'}<br />
                    <strong>Website:</strong> {college.website || 'N/A'}<br />
                  </Card.Text>
                  {college.accreditationCertificate && (
                    <div style={styles.imageContainer}>
                      <h6 style={styles.imageTitle}>Accreditation Certificate:</h6>
                      <a 
                        href={`http://localhost:5000/api/auth/download/accreditation/${college.collegeName}`}
                        download 
                        className="btn btn-primary">
                        Download Accreditation Certificate
                      </a>
                    </div>
                  )}
                  {college.legalDocuments && (
                    <div style={styles.imageContainer}>
                      <h6 style={styles.imageTitle}>Legal Documents:</h6>
                      <a 
                        href={`http://localhost:5000/api/auth/download/legal/${college.collegeName}`}
                        download 
                        className="btn btn-primary">
                        Download Legal Documents
                      </a>
                    </div>
                  )}
                  <Button
                    variant="success"
                    onClick={() => handleApproveCollege(college._id)}
                    style={styles.approveButton}
                  >
                    Approve
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p style={{ textAlign: 'center', color: '#7f8c8d' }}>No colleges pending approval.</p>
      )}
    </Container>
  );
};

export default ApproveColleges;
