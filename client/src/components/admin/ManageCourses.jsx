import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../Sidebar/Sidebar';
import './ManageCourses.css'; // Import the external CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newCourseField, setNewCourseField] = useState(''); // New state for Course Field
  const [isEditMode, setIsEditMode] = useState(false); // To track if we're adding or editing
  const [currentCourseId, setCurrentCourseId] = useState(null); // To store the course ID being edited
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch active courses from the backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/fetch-courses`);
      setCourses(response.data.filter(course => !course.isDisabled)); // Fetch only active courses
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Handle opening the modal to edit a course
  const handleEditCourse = (course) => {
    setNewCourseName(course.courseName);
    setNewCourseDescription(course.courseDescription);
    setNewCourseField(course.courseField); // Set the course field for editing
    setCurrentCourseId(course._id); // Store the course ID being edited
    setIsEditMode(true); // Switch to edit mode
    setShowAddCourseModal(true); // Open the modal
  };

  // Handle deleting (disabling) a course
  const handleDeleteCourse = async (courseId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will disable the course',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, disable it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/api/course-disable/${courseId}`);
        fetchCourses(); // Refresh the course list after disabling
        Swal.fire('Success', 'Course disabled successfully', 'success');
      } catch (error) {
        console.error('Error disabling course:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`);
      localStorage.removeItem('token');
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle showing the modal to add a new course
  const handleShowAddCourseModal = () => {
    setIsEditMode(false); // Ensure we are in add mode
    setNewCourseName('');
    setNewCourseDescription('');
    setNewCourseField(''); // Reset the course field
    setCurrentCourseId(null); // Reset the current course ID
    setShowAddCourseModal(true);
  };

  // Close the modal
  const handleCloseAddCourseModal = () => {
    setShowAddCourseModal(false);
  };

  // Handle adding or editing a course
  const handleAddOrEditCourse = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        courseName: newCourseName,
        courseDescription: newCourseDescription,
        courseField: newCourseField, // Ensure this is included
      };

      if (isEditMode) {
        // Update existing course
        await axios.put(`${import.meta.env.VITE_BASE_URL}/api/course-update/${currentCourseId}`, courseData);
        Swal.fire("Success", "Course updated successfully", "success");
      } else {
        // Add new course
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/course-add`, courseData);
        Swal.fire("Success", "Course added successfully", "success");
      }

      fetchCourses(); // Refresh the course list
      handleCloseAddCourseModal(); // Close the modal
    } catch (error) {
      console.error("Error adding/updating course:", error);
      Swal.fire("Error", "Failed to add/update course", "error");
    }
  };

  // Navigate to DeletedCourses page when the button is clicked
  const handleShowDeletedCourses = () => {
    navigate('/deleted-courses'); // Navigate to the DeletedCourses component/page
  };

  return (
    <div className="layout">
      <Sidebar handleLogout={handleLogout}/>
      <div className="container">
        <h2 className="header">Manage Courses</h2>
        <Button variant="primary" onClick={handleShowAddCourseModal} className="addbtn">
          Add Course
        </Button>
        <Button variant="secondary" onClick={handleShowDeletedCourses} className="disablebtn">
          Disabled Courses
        </Button>

        <Table striped bordered hover className="table">
          <thead className="tableHeader">
            <tr>
              <th>Course Name</th>
              <th>Description</th>
              <th>Field</th> {/* New column for Course Field */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.courseName}</td>
                  <td>{course.courseDescription}</td>
                  <td>{course.courseField}</td> {/* Display Course Field */}
                  <td>
                    <Button onClick={() => handleEditCourse(course)} className="editc">
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteCourse(course._id)} className="deletec">
                      Disable
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No courses available</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Add/Edit Course Modal */}
        <Modal 
          show={showAddCourseModal} 
          onHide={handleCloseAddCourseModal}
          style={{ zIndex: 1050 }}
          backdrop="static"
        >
          <Modal.Header closeButton>
            <Modal.Title>{isEditMode ? 'Edit Course' : 'Add New Course'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddOrEditCourse(e);
            }}>
              <Form.Group controlId="formCourseName" className="mb-3">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter course name"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCourseDescription" className="mb-3">
                <Form.Label>Course Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter course description"
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCourseField" className="mb-3">
                <Form.Label>Course Field</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter course field"
                  value={newCourseField}
                  onChange={(e) => setNewCourseField(e.target.value)}
                  required
                />
              </Form.Group>
              <Button className="addup" variant="primary" type="submit">
                {isEditMode ? 'Update Course' : 'Add Course'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

export default ManageCourses;
