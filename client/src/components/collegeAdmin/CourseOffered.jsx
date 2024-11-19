import React, { useState, useEffect } from "react";
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
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/fetch-courses`);
      setCourses(response.data);

      const collegeId = localStorage.getItem("collegeId");
      if (collegeId) {
        const offeredResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/offered-courses/${collegeId}`);
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

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/offer-course`, {
        courseId: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        duration: formData.duration,
        price: formData.price,
        collegeId: collegeId,
      });

      fetchCourses();
      Swal.fire("Success", "Course offered successfully", "success");
    } catch (error) {
      console.error("Error offering course:", error.response?.data || error.message);
      Swal.fire("Error", `Failed to offer course: ${error.response?.data?.message || error.message}`, "error");
    }
  };

  const handleRemoveOffer = async (course) => {
    try {
      const collegeId = localStorage.getItem("collegeId");
      if (!collegeId) {
        throw new Error("College ID not found");
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/remove-course-offer`, {
        courseId: course._id,
        collegeId: collegeId,
      });

      if (response.data.message === "Course offer removed successfully") {
        fetchCourses();
        Swal.fire("Success", "Course is no longer offered", "success");
      }
    } catch (error) {
      console.error("Error removing offer:", error.response?.data || error.message);
      Swal.fire("Error", `Failed to remove offer: ${error.response?.data?.message || error.message}`, "error");
    }
  };

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

  const handleAddNotes = async (course) => {
    const { value: formValues } = await Swal.fire({
      title: 'Add Course Notes',
      html: `
        <div id="note-inputs">
          <div class="note-entry" style="margin-bottom: 15px;">
            <input type="text" class="swal2-input note-title" placeholder="Note Title">
            <input type="file" class="swal2-file note-file" accept="application/pdf">
          </div>
        </div>
        <button type="button" id="add-more" class="swal2-confirm swal2-styled" style="margin-top: 10px;">Add Another File</button>
      `,
      didOpen: () => {
        // Add click handler for "Add Another File" button
        document.getElementById('add-more').addEventListener('click', () => {
          const noteInputs = document.getElementById('note-inputs');
          const newEntry = document.createElement('div');
          newEntry.className = 'note-entry';
          newEntry.style = 'margin-bottom: 15px;';
          newEntry.innerHTML = `
            <input type="text" class="swal2-input note-title" placeholder="Note Title">
            <input type="file" class="swal2-file note-file" accept="application/pdf">
            <button type="button" class="swal2-confirm swal2-styled remove-entry" style="background-color: #dc3545;">Remove</button>
          `;
          noteInputs.appendChild(newEntry);

          // Add remove handler
          newEntry.querySelector('.remove-entry').addEventListener('click', () => {
            newEntry.remove();
          });
        });
      },
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Upload',
      preConfirm: () => {
        const entries = document.querySelectorAll('.note-entry');
        const files = [];
        const titles = [];
        
        for (let entry of entries) {
          const title = entry.querySelector('.note-title').value;
          const file = entry.querySelector('.note-file').files[0];
          
          if (!title || !file) {
            Swal.showValidationMessage('Please fill all fields');
            return false;
          }
          
          files.push(file);
          titles.push(title);
        }
        
        return { files, titles };
      }
    });

    if (formValues) {
      const { files, titles } = formValues;
      const formData = new FormData();
      
      // Append each file and title
      files.forEach((file, index) => {
        formData.append('notes', file);
        formData.append('titles', titles[index]);
      });
      
      formData.append('courseId', course._id);
      console.log("Course ID",course._id)
      formData.append('collegeId', localStorage.getItem('collegeId'));
      console.log("College  id:",localStorage.getItem('collegeId'))
      formData.append('courseName', course.courseName);
      console.log("Course Name:",course.courseName)

      try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/upload-course-notes`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        Swal.fire('Success', 'Notes uploaded successfully', 'success');
      } catch (error) {
        console.error('Error uploading notes:', error);
        Swal.fire('Error', 'Failed to upload notes', 'error');
      }
    }
  };

  const styles = {
    mainContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '250px', // Adjust for sidebar width
    },
    contentWrapper: {
      flex: 1,
      padding: '20px',
    },
    headerSection: {
      marginBottom: '20px',
    },
    headerTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
    },
    tableContainer: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    },
    tableHeader: {
      backgroundColor: '#007bff',
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'left',
      padding: '12px',
    },
    courseName: {
      padding: '12px',
      borderBottom: '1px solid #dee2e6',
      fontWeight: 'bold',
      color: '#007bff',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    description: {
      padding: '12px',
      borderBottom: '1px solid #dee2e6',
      maxWidth: '200px',
      whiteSpace: 'normal',
      overflow: 'visible',
      textOverflow: 'clip',
      lineHeight: '1.4',
    },
    tableCell: {
      padding: '12px',
      borderBottom: '1px solid #dee2e6',
    },
    offerButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    disabledButton: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'not-allowed',
    },
    removeButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      marginLeft: '10px',
      transition: 'background-color 0.3s',
    },
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
                <th style={styles.tableHeader}>Course Name</th>
                <th style={styles.tableHeader}>Description</th>
                <th style={styles.tableHeader}>Field</th>
                <th style={styles.tableHeader}>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const isOffered = offeredCourses.some(offered => offered.courseId === course._id);
                return (
                  <tr key={course._id}>
                    <td style={styles.courseName}>{course.courseName}</td>
                    <td style={styles.description}>{course.courseDescription}</td>
                    <td style={styles.tableCell}>{course.courseField}</td>
                    <td style={styles.tableCell}>
                      {isOffered ? (
                        <>
                          <button style={styles.disabledButton} disabled>Offered</button>
                          <button onClick={() => handleRemoveOffer(course)} style={styles.removeButton}>Not Offering</button>
                          <button 
                            onClick={() => handleAddNotes(course)} 
                            style={{
                              ...styles.offerButton,
                              backgroundColor: '#17a2b8',
                              marginLeft: '10px'
                            }}
                          >
                            Add Notes
                          </button>
                        </>
                      ) : (
                        <button onClick={() => handleOfferCourse(course)} style={styles.offerButton}>Offer Course</button>
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
