import React, { useState, useEffect } from 'react';
import './CollegeAdminDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios'; // Import axios for API requests

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Colors for pie chart segments

const CollegeAdmin = () => {
  const [dashboardData, setDashboardData] = useState({
    studentCount: 150,
    courseCount: 0, // Initialize courseCount to 0
    revenue: 50000,
  });

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    courseDuration: '',
    coursePrice: '',
    maxEnrollment: '',
    courseDescription: ''
  });

  const [courseEnrollmentData, setCourseEnrollmentData] = useState([]); // State to hold course enrollment data

  useEffect(() => {
    const fetchCourseCountAndEnrollmentData = async () => {
      try {
        // Fetch course count
        const countResponse = await axios.get('http://localhost:5000/api/course-count');
        setDashboardData(prevData => ({
          ...prevData,
          courseCount: countResponse.data.count // Update courseCount with fetched value
        }));
  
        // Fetch course enrollment data
        const enrollmentResponse = await axios.get('http://localhost:5000/api/course-enrollment'); 
        
        // Log the full API response to see its structure
        console.log('Enrollment Data Response:', enrollmentResponse.data);
  
        const formattedData = enrollmentResponse.data.map(course => ({
          name: course.courseName, // Check what the actual field name is
        }));
  
        setCourseEnrollmentData(formattedData); // Set the enrollment data for pie chart
      } catch (error) {
        console.error('Error fetching course count or enrollment data:', error);
      }
    };
  
    fetchCourseCountAndEnrollmentData(); // Fetch both course count and enrollment data on component mount
  }, []); // Empty dependency array to run once
   // Empty dependency array to run once
   // Empty dependency array to run once

  const handleAddCourse = () => {
    setShowAddCourseModal(true);
  };

  const handleCloseAddCourseModal = () => {
    setShowAddCourseModal(false);
    setNewCourse({
      courseName: '',
      courseDuration: '',
      coursePrice: '',
      maxEnrollment: '',
      courseDescription: ''
    }); // Reset form
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/courses', newCourse);
      alert(response.data.message); // Show success message
      handleCloseAddCourseModal();
      
      // Optionally, re-fetch course count and enrollment data to update the display
      const countResponse = await axios.get('http://localhost:5000/api/course-count');
      setDashboardData(prevData => ({
        ...prevData,
        courseCount: countResponse.data.count // Update course count after adding a course
      }));

      // Re-fetch enrollment data
      const enrollmentResponse = await axios.get('http://localhost:5000/api/course-enrollment');
      const formattedData = enrollmentResponse.data.map(course => ({
        name: course.courseName,
      }));
      
      setCourseEnrollmentData(formattedData);
      console.log("data",courseEnrollmentData) // Update pie chart data
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Error adding course. Please try again.');
    }
  };
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      // Redirect to login page or clear session
      window.location.href = '/'; // Adjust to your login route
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Static data for the pie chart
  const staticData = [
    { value: 50 }, // Static value for course 1
    { value: 30 }, // Static value for course 2
    { value: 20 }, // Static value for course 3
    { value: 10 }, // Static value for course 4
  ];

  return (
    <div className="college-admin-dashboard-container">
      <div className="dashboard-header">
        <h1>College Admin Dashboard</h1>
        <p>Welcome back! Here's an overview of the latest metrics.</p>
        <Button variant="danger" onClick={ handleLogout}>
          Logout
        </Button>
      </div>

      <div className="dashboard-overview">
        <div className="dashboard-card">
          <h3>Total Students Enrolled</h3>
          <p>{dashboardData.studentCount}</p>
        </div>
        <div className="dashboard-card">
          <h3>Courses Offered</h3>
          <p>{dashboardData.courseCount}</p> {/* Display fetched course count */}
        </div>
        <div className="dashboard-card">
          <h3>Total Revenue</h3>
          <p>${dashboardData.revenue}</p>
        </div>
        <div className="dashboard-card add-course-card" onClick={handleAddCourse}>
          <h3>Add Courses</h3>
          <Button variant="primary">+ Add Course</Button>
        </div>
      </div>

      {/* Student Enrollment by Course Section */}
      <div className="course-enrollment-section">
        <h2>Student Enrollment by Course</h2>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={staticData} // Use static data for pie values
              dataKey="value"
              nameKey="name" // Use name from courseEnrollmentData for labels
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label={staticData} 
            >
              {staticData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Modal to Add Course */}
      <Modal show={showAddCourseModal} onHide={handleCloseAddCourseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitCourse}>
            {/* Course Name */}
            <Form.Group controlId="formCourseName">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                name="courseName"
                value={newCourse.courseName}
                placeholder="Enter course name"
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Course Duration */}
            <Form.Group controlId="formCourseDuration">
              <Form.Label>Course Duration</Form.Label>
              <Form.Control
                type="text"
                name="courseDuration"
                value={newCourse.courseDuration}
                placeholder="Enter course duration"
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Course Price */}
            <Form.Group controlId="formCoursePrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="coursePrice"
                value={newCourse.coursePrice}
                placeholder="Enter course price"
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Maximum Enrollment */}
            <Form.Group controlId="formMaxEnrollment">
              <Form.Label>Maximum Enrollment</Form.Label>
              <Form.Control
                type="number"
                name="maxEnrollment"
                value={newCourse.maxEnrollment}
                placeholder="Enter max number of students"
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Course Description */}
            <Form.Group controlId="formCourseDescription">
              <Form.Label>Course Description</Form.Label>
              <Form.Control
                as="textarea"
                name="courseDescription"
                value={newCourse.courseDescription}
                rows={3}
                placeholder="Enter a brief description of the course"
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit">
              Add Course
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CollegeAdmin;
