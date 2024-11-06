import React, { useState, useEffect } from "react";
import "../Sidebar/CollegeSidebar.css";
import { useNavigate } from "react-router-dom";
import CollegeSidebar from "../Sidebar/CollegeSidebar";
import axios from "axios";
import Swal from "sweetalert2";

const CourseOffered = () => {
  const navigate = useNavigate(); 
  const [courses, setCourses] = useState([]);
  const [offeredCourses, setOfferedCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/fetch-courses"
      );
      setCourses(response.data);

      const collegeId = localStorage.getItem("collegeId");
      if (collegeId) {
        const offeredResponse = await axios.get(
          `http://localhost:5000/api/auth/offered-courses/${collegeId}`
        );

        setOfferedCourses(offeredResponse.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOfferCourse = (course) => {
    Swal.fire({
      title: "Offer Course",
      html:
        '<input id="swal-duration" class="swal2-input" placeholder="Duration (in months)">' +
        '<input id="swal-price" class="swal2-input" placeholder="Price (in USD)">',
      focusConfirm: false,
      preConfirm: () => {
        return {
          duration: document.getElementById("swal-duration").value,
          price: document.getElementById("swal-price").value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmitOffer(course, result.value);
      }
    });
  };

  const handleSubmitOffer = async (course, formData) => {
    try {
      const collegeId = localStorage.getItem("collegeId");

      if (!collegeId) {
        throw new Error("College ID not found");
      }

      const response = await axios.post(
        "http://localhost:5000/api/offer-course",
        {
          courseId: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          duration: formData.duration,
          price: formData.price,
          collegeId: collegeId,
        }
      );

      fetchCourses();
      Swal.fire("Success", "Course offered successfully", "success");
    } catch (error) {
      console.error(
        "Error offering course:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Error",
        `Failed to offer course: ${
          error.response?.data?.message || error.message
        }`,
        "error"
      );
    }
  };

  const handleRemoveOffer = async (course) => {
    try {
      const collegeId = localStorage.getItem("collegeId");
      if (!collegeId) {
        throw new Error("College ID not found");
      }

      const response = await axios.post(
        "http://localhost:5000/api/remove-course-offer",
        {
          courseId: course._id,
          collegeId: collegeId,
        }
      );

      if (response.data.message === "Course offer removed successfully") {
        fetchCourses();
        Swal.fire("Success", "Course is no longer offered", "success");
      }
    } catch (error) {
      console.error(
        "Error removing offer:",
        error.response?.data || error.message
      );
      Swal.fire(
        "Error",
        `Failed to remove offer: ${
          error.response?.data?.message || error.message
        }`,
        "error"
      );
    }
  };

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

  const styles = {
    mainContainer: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    },
    contentWrapper: {
      flex: 1,
      padding: '2rem',
      marginLeft: '250px',
      backgroundColor: '#f4f4f4'
    },
    headerSection: {
      marginBottom: '20px'
    },
    headerTitle: {
      color: '#333',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      padding: '12px',
      textAlign: 'left',
      backgroundColor: '#007bff',
      color: 'white',
      fontWeight: 'bold'
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #ddd'
    },
    courseName: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      fontWeight: 'bold',
      color: '#007bff'
    },
    description: {
      padding: '12px',
      borderBottom: '1px solid #ddd',
      maxWidth: '500px',
      whiteSpace: 'normal',
      overflow: 'visible',
      textOverflow: 'clip',
      lineHeight: '1.4'
    },
    offerButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    disabledButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'not-allowed'
    },
    removeButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginLeft: '10px',
      transition: 'background-color 0.3s'
    }
  };

  return (
    <div style={styles.mainContainer}>
      <CollegeSidebar handleLogout={handleLogout} />
      <div style={styles.contentWrapper}>
        <div style={styles.headerSection}>
          <h1 style={styles.headerTitle}>Courses Offered</h1>
        </div>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.tableHeader, width: '30%' }}>Course Name</th>
                <th style={{ ...styles.tableHeader, width: '50%' }}>Description</th>
                <th style={{ ...styles.tableHeader, width: '20%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const isOffered = offeredCourses.some(
                  (offered) => offered.courseId === course._id
                );
                return (
                  <tr key={course._id}>
                    <td style={styles.courseName}>{course.courseName}</td>
                    <td style={styles.description}>{course.courseDescription}</td>
                    <td style={styles.tableCell}>
                      {isOffered ? (
                        <>
                          <button style={styles.disabledButton} disabled>
                            Offered
                          </button>
                          <button
                            onClick={() => handleRemoveOffer(course)}
                            style={styles.removeButton}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                          >
                            Not Offering
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleOfferCourse(course)}
                          style={styles.offerButton}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                        >
                          Offer Course
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseOffered;
