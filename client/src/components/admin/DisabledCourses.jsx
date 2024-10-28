// DisabledCourses.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Swal from 'sweetalert2';
import './DisabledCourses.css';

const DisabledCourses = () => {
  const [deletedCourses, setDeletedCourses] = useState([]);

  useEffect(() => {
    fetchDeletedCourses();
  }, []);

  // Fetch deleted (disabled) courses from the backend
  const fetchDeletedCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/disabled-courses');
      console.log('Deleted Courses fetched from API:', response.data);
      setDeletedCourses(response.data);
    } catch (error) {
      console.error('Error fetching deleted courses:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      localStorage.removeItem('token');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Function to handle enabling a course
  const enableCourse = async (courseId) => {
    try {
      await axios.put(`http://localhost:5000/api/course-enable/${courseId}`);
      fetchDeletedCourses();
      Swal.fire({
        icon: 'success',
        title: 'Course Enabled',
        text: 'The course has been enabled successfully!',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error enabling course:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to enable the course!',
      });
    }
  };

  // Function to handle permanent deletion of a course
  const deleteCourse = async (courseId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will permanently delete the course!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/course-delete/${courseId}`);
          fetchDeletedCourses();
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The course has been deleted permanently.',
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (error) {
          console.error('Error deleting course:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the course!',
          });
        }
      }
    });
  };

  return (
    <div className="layout">
      <Sidebar handleLogout={handleLogout}/>
      <div className="container">
        <h2 className="header">Disabled Courses</h2>
        <Table striped bordered hover className="table">
          <thead className="tableHeader">
            <tr>
              <th>Course Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deletedCourses.length > 0 ? (
              deletedCourses.map((course) => (
                <tr key={course._id}>
                  <td>{course.courseName}</td>
                  <td>{course.courseDescription}</td>
                  <td>
                    <Button
                      onClick={() => enableCourse(course._id)}
                      className="enable-button"
                      variant="success"
                    >
                      Enable
                    </Button>{' '}
                    <Button
                      onClick={() => deleteCourse(course._id)}
                      className="delete-button"
                      variant="danger"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No deleted courses</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default DisabledCourses;
