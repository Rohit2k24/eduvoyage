import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../Sidebar/Sidebar';
import './ManageCourses.css'; // Import the external CSS file

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [deletedCourses, setDeletedCourses] = useState([]); // State for deleted courses
  const [showDeletedCourses, setShowDeletedCourses] = useState(false); // To toggle showing deleted courses
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [isEditMode, setIsEditMode] = useState(false); // To track if we're adding or editing
  const [currentCourseId, setCurrentCourseId] = useState(null); // To store the course ID being edited

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch active courses from the backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fetch-courses');
      setCourses(response.data.filter(course => !course.isDisabled)); // Fetch only active courses
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Fetch deleted (disabled) courses
  const fetchDeletedCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/disabled-courses');
      setDeletedCourses(response.data);
    } catch (error) {
      console.error('Error fetching deleted courses:', error);
    }
  };

  // Handle opening the modal to edit a course
  const handleEditCourse = (course) => {
    setNewCourseName(course.courseName);
    setNewCourseDescription(course.courseDescription);
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
        await axios.put(`http://localhost:5000/api/course-disable/${courseId}`);
        fetchCourses(); // Refresh the course list after disabling
        Swal.fire('Success', 'Course disabled successfully', 'success');
      } catch (error) {
        console.error('Error disabling course:', error);
      }
    }
  };

  // Handle showing the modal to add a new course
  const handleShowAddCourseModal = () => {
    setIsEditMode(false); // Ensure we are in add mode
    setNewCourseName('');
    setNewCourseDescription('');
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

    const courseData = {
      courseName: newCourseName,
      courseDescription: newCourseDescription,
    };

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/course-update/${currentCourseId}`, courseData);
        Swal.fire('Success', 'Course updated successfully', 'success');
      } else {
        await axios.post('http://localhost:5000/api/course-add', courseData);
        Swal.fire('Success', 'Course added successfully', 'success');
      }

      fetchCourses(); // Refresh the course list
      handleCloseAddCourseModal(); // Close the modal after success
    } catch (error) {
      console.error('Error adding/updating course:', error);
    }
  };

  // Show deleted courses when button is clicked
  const handleShowDeletedCourses = async () => {
    await fetchDeletedCourses();
    setShowDeletedCourses(true); // Show the deleted courses section
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="container">
        <h2 className="header">Manage Courses</h2>
        <Button variant="primary" onClick={handleShowAddCourseModal} className="button">
          Add Course
        </Button>
        <Button variant="secondary" onClick={handleShowDeletedCourses} className="button">
          Deleted Courses
        </Button>

        <Table striped bordered hover className="table">
          <thead className="tableHeader">
            <tr>
              <th>Course Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.courseName}</td>
                  <td>{course.courseDescription}</td>
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
                <td colSpan="3" className="text-center">No courses available</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Deleted Courses Table */}
        {showDeletedCourses && (
          <div className="deleted-courses">
            <h3>Deleted Courses</h3>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {deletedCourses.length > 0 ? (
                  deletedCourses.map((course) => (
                    <tr key={course._id}>
                      <td>{course.courseName}</td>
                      <td>{course.courseDescription}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center">No deleted courses</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )}

        {/* Add/Edit Course Modal */}
        <Modal show={showAddCourseModal} onHide={handleCloseAddCourseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditMode ? 'Edit Course' : 'Add New Course'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddOrEditCourse}>
              <Form.Group controlId="formCourseName">
                <Form.Label>Course Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter course name"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formCourseDescription">
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
              <Button variant="primary" type="submit">
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
