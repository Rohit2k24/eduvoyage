import React, { useState, useEffect } from 'react';
import '../Sidebar/CollegeSidebar.css';
import CollegeSidebar from '../Sidebar/CollegeSidebar';
import axios from 'axios';
import Swal from 'sweetalert2';

const CourseOffered = () => {
  const [courses, setCourses] = useState([]);
  const [offeredCourses, setOfferedCourses] = useState([]); // New state to track offered courses

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/fetch-courses');
        setCourses(response.data);

        const collegeId = localStorage.getItem('collegeId');
        if (collegeId) {
          const offeredResponse = await axios.get(`http://localhost:5000/api/fetch-offered-courses/${collegeId}`);
          setOfferedCourses(offeredResponse.data.offeredCourses);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleOfferCourse = (course) => {
    Swal.fire({
      title: 'Offer Course',
      html:
        '<input id="swal-duration" class="swal2-input" placeholder="Duration (in months)">' +
        '<input id="swal-price" class="swal2-input" placeholder="Price (in USD)">',
      focusConfirm: false,
      preConfirm: () => {
        return {
          duration: document.getElementById('swal-duration').value,
          price: document.getElementById('swal-price').value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmitOffer(course, result.value);
      }
    });
  };

  const handleSubmitOffer = async (course, formData) => {
    try {
      const collegeId = localStorage.getItem('collegeId');
      
      if (!collegeId) {
        throw new Error('College ID not found');
      }

      const response = await axios.post('http://localhost:5000/api/offer-course', {
        courseId: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        duration: formData.duration,
        price: formData.price,
        collegeId: collegeId
      });

      setOfferedCourses((prevOfferedCourses) => [...prevOfferedCourses, course._id]);
      Swal.fire('Success', 'Course offered successfully', 'success');
    } catch (error) {
      console.error('Error offering course:', error.response?.data || error.message);
      Swal.fire('Error', `Failed to offer course: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  const handleRemoveOffer = async (course) => {
    try {
      const collegeId = localStorage.getItem('collegeId');
      if (!collegeId) {
        throw new Error('College ID not found');
      }
  
      const response = await axios.post('http://localhost:5000/api/remove-course-offer', {
        courseId: course._id,
        collegeId: collegeId,
      });
  
      if (response.data.message === "Course offer removed successfully") {
        
        Swal.fire('Success', 'Course is no longer offered', 'success');
      } 
    } catch (error) {
      console.error('Error removing offer:', error.response?.data || error.message);
      Swal.fire('Error', `Failed to remove offer: ${error.response?.data?.message || error.message}`, 'error');
    }
  };

  
  const tableHeaderStyle = {
    padding: '12px',
    textAlign: 'left',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: 'bold',
  };

  const tableCellStyle = {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  };

  const courseNameStyle = {
    ...tableCellStyle,
    fontWeight: 'bold',
    color: '#007bff',
  };

  const descriptionStyle = {
    ...tableCellStyle,
    maxWidth: '500px',
    whiteSpace: 'normal',
    overflow: 'visible',
    textOverflow: 'clip',
    lineHeight: '1.4',
  };

  const offerButtonStyle = {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const notOfferingButtonStyle = {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '10px',
    transition: 'background-color 0.3s',
  };

  return (
    <div className="college-admin-dashboard-container">
      <CollegeSidebar />
      <div className="content" style={{ padding: '20px', backgroundColor: '#f4f4f4' }}>
        <div className="dashboard-header" style={{ marginBottom: '20px' }}>
          <h1 style={{ color: '#333', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Courses Offered</h1>
        </div>
        <div className="courses-table" style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}>
            <thead>
              <tr>
                <th style={{ ...tableHeaderStyle, width: '30%' }}>Course Name</th>
                <th style={{ ...tableHeaderStyle, width: '50%' }}>Description</th>
                <th style={{ ...tableHeaderStyle, width: '20%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td style={courseNameStyle}>{course.courseName}</td>
                  <td style={descriptionStyle}>{course.courseDescription}</td>
                  <td style={tableCellStyle}>
                    {offeredCourses.includes(course._id) ? (
                      <>
                        <button style={{ ...offerButtonStyle, backgroundColor: '#6c757d', cursor: 'not-allowed' }} disabled>
                          Offered
                        </button>
                        <button
                          onClick={() => handleRemoveOffer(course)}
                          style={notOfferingButtonStyle}
                          onMouseOver={(e) => (e.target.style.backgroundColor = '#c82333')}
                          onMouseOut={(e) => (e.target.style.backgroundColor = '#dc3545')}
                        >
                          Not Offering
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleOfferCourse(course)}
                        style={offerButtonStyle}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
                      >
                        Offer Course
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseOffered;
