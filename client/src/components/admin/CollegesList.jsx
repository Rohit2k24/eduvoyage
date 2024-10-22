import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Card, Container, Row, Col } from 'react-bootstrap';
import Swal from 'sweetalert2';
const CollegesList = () => {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/colleges');
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    }
  };

  const styles = {
    container: {
      padding: '30px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      color: '#2c3e50',
      marginBottom: '20px',
      borderBottom: '2px solid #3498db',
      paddingBottom: '10px',
    },
    table: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    tableHeader: {
      backgroundColor: '#3498db',
      color: 'white',
    },
    tableCell: {
      verticalAlign: 'middle',
    },
    status: {
      padding: '5px 10px',
      borderRadius: '20px',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  };

  const getStatusStyle = (status) => {
    // Provide a default status if it's undefined
    const safeStatus = status;
    
    switch (safeStatus) {
      case 'true':
        return { backgroundColor: '#2ecc71', color: 'white' };
      default:
        return { backgroundColor: '#f39c12', color: 'white' };
    }
  };

  const disableCollege = async (collegeId) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "This will disable the college.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, disable it!',
      });

      if (result.isConfirmed) {
        await axios.patch(`http://localhost:5000/api/auth/colleges/${collegeId}/disable`);
        fetchColleges(); // Refresh the list after disabling

        Swal.fire("Success", "College disabled successfully", "success");
      } else {
        Swal.fire("Cancelled", "The college is still active", "info");
      }
    } catch (error) {
      console.error('Error disabling college:', error);
      Swal.fire("Error", "There was an error disabling the college", "error");
    }
  };

  return (
    <Container fluid style={styles.container}>
      <Row>
        <Col>
          <h2 style={styles.header}>List of Colleges</h2>
          <Card style={styles.table}>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>College Name</th>
                  <th style={styles.tableHeader}>Address</th>
                  <th style={styles.tableHeader}>Email</th>
                  <th style={styles.tableHeader}>Contact Person</th>
                  <th style={styles.tableHeader}>Phone Number</th>
                  <th style={styles.tableHeader}>Website</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map((college) => (
                  <tr key={college._id}>
                    <td style={styles.tableCell}>{college.collegeName}</td>
                    <td style={styles.tableCell}>{college.address}</td>
                    <td style={styles.tableCell}>{college.email}</td>
                    <td style={styles.tableCell}>{college.contactPerson}</td>
                    <td style={styles.tableCell}>{college.phoneNumber}</td>
                    <td style={styles.tableCell}>{college.website}</td>
                    <td style={styles.tableCell}>
                      <div
                        style={styles.status}>{college.isApproved ? 'Approved' : 'Pending'}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <button 
                        onClick={() => disableCollege(college._id)} 
                        style={{
                          backgroundColor: '#e74c3c', // Red background
                          color: 'white', // White text
                          border: 'none', // No border
                          borderRadius: '5px', // Rounded corners
                          padding: '10px 15px', // Padding for size
                          cursor: 'pointer', // Pointer cursor on hover
                          transition: 'background-color 0.3s', // Smooth transition
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'} // Darker red on hover
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'} // Original red on leave
                      >
                        Unapprove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CollegesList;
