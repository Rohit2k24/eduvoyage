import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
import Sidebar from '../Sidebar/Sidebar';

const ApproveColleges = () => {
  const [unapprovedColleges, setUnapprovedColleges] = useState([]);

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
      Swal.fire("Success", "College approved successfully", "success");
    } catch (error) {
      console.error('Error approving college:', error);
      Swal.fire("Error", "Failed to approve college. Please try again.", "error");
    }
  };

  const handleDeclineCollege = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/decline-college/${id}`);
      fetchUnapprovedColleges();
      Swal.fire("Success", "College request declined and deleted", "success");
    } catch (error) {
      console.error('Error declining college:', error);
      Swal.fire("Error", "Failed to decline college. Please try again.", "error");
    }
  };

  const styles = {
    layout: {
      display: 'flex',
      height: '100vh', // Full height of the viewport
    },
    container: {
      padding: '2rem',
      margin: '0 auto',
      flexGrow: 1, // Allow the container to grow
      overflowY: 'auto', // Allow scrolling if content overflows
    },
    header: {
      color: '#2c3e50',
      marginBottom: '2rem',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '24px',
    },
    row: {
      justifyContent: 'center',
    },
    col: {
      marginBottom: '30px',
      display: 'flex',
      justifyContent: 'center',
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      padding: '20px',
      border: '1px solid #3498db', // Add a solid border with a color
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Enhanced shadow for better depth
      transition: 'transform 0.2s',
      backgroundColor: '#fff', // Ensure the background is white
    },
    cardTitle: {
      color: '#3498db',
      fontWeight: 'bold',
      marginBottom: '1rem',
      fontSize: '1.2rem',
    },
    cardText: {
      fontSize: '0.9rem',
      color: '#34495e',
      lineHeight: '1.5',
    },
    imageContainer: {
      margin: '1rem 0',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '15px',
    },
    approveButton: {
      backgroundColor: '#2ecc71',
      color: '#fff',
      border: 'none',
      padding: '10px',
      borderRadius: '5px',
      transition: 'background-color 0.2s',
      width: '48%',
    },
    declineButton: {
      backgroundColor: '#e74c3c',
      color: '#fff',
      border: 'none',
      padding: '10px',
      borderRadius: '5px',
      transition: 'background-color 0.2s',
      width: '48%',
    },
    noCollegesText: {
      textAlign: 'center',
      color: '#7f8c8d',
      fontSize: '18px',
    },
    mainContent: {
      padding: '20px',
    },
  };

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.container}>
        <Container>
          <h2 style={styles.header}>Approve Colleges</h2>
          {unapprovedColleges.length > 0 ? (
            <Row style={styles.row}>
              {unapprovedColleges.map((college) => (
                <Col key={college._id} md={6} lg={4} style={styles.col}>
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
                          <a
                            href={`http://localhost:5000/api/auth/download/accreditation/${college.collegeName}`}
                            download
                            className="btn btn-primary"
                          >
                            Download Accreditation Certificate
                          </a>
                        </div>
                      )}
                      {college.legalDocuments && (
                        <div style={styles.imageContainer}>
                          <a
                            href={`http://localhost:5000/api/auth/download/legal/${college.collegeName}`}
                            download
                            className="btn btn-primary"
                          >
                            Download Legal Documents
                          </a>
                        </div>
                      )}
                      <div style={styles.buttonContainer}>
                        <Button
                          variant="success"
                          onClick={() => handleApproveCollege(college._id)}
                          style={styles.approveButton}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeclineCollege(college._id)}
                          style={styles.declineButton}
                        >
                          Decline
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <p style={styles.noCollegesText}>No colleges pending approval.</p>
          )}
        </Container>
      </div>
    </div>
  );
};

export default ApproveColleges;
