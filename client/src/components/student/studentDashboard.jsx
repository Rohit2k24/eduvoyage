import React, { useEffect, useState } from 'react';
import './studentDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
// Sample data for the chart
const data = [


const StudentDashboard = () => {
  const [user, setUser] = useState({ firstname: '', lastname: '' }); // State for user data
  const [courses, setCourses] = useState([]); // State for course data
  const [activeTab, setActiveTab] = useState('Dashboard'); // State for active sidebar tab
  const [selectedCourse, setSelectedCourse] = useState(null); // State to store selected course details
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [formData, setFormData] = useState({
    salutation: '',
    name: '',
    email: '',
    phone: '',
  }); // State to store form data
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/course-view'); // Fetch courses
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setErrorMessage('Failed to load courses. Please try again later.'); // Set error message
      }
    };

    fetchCourses(); // Fetch courses on component mount
  }, []);

  // Fetch user data from token (you may need to adjust this according to your auth flow)
  useEffect(() => {
    // Fetch user data
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      window.location.href = '/'; // Adjust to your login route
    } catch (error) {
      console.error('Error logging out:', error);
      setErrorMessage('Logout failed. Please try again.'); // Set error message
    }
  };

  const enrollCourse = (course) => {
    console.log('Course enrolled:', course); 
    setSelectedCourse(course); // Set the selected course
    setShowModal(true); // Show the modal
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form data
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/enroll-course', {
        ...formData,
        courseId: selectedCourse._id,
        courseName: selectedCourse.name,
        duration: selectedCourse.duration,
        price: selectedCourse.price, // Assuming price is part of the course data
      });

      if (response.status === 200) {
        alert('Enrolled successfully!');
        setShowModal(false); // Close modal after successful enrollment
        setFormData({ salutation: '', name: '', email: '', phone: '' }); // Reset form data
      }
    } catch (error) {
      console.error('Error enrolling course:', error);
      setErrorMessage('Enrollment failed. Please try again.'); // Set error message
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Header Bar */}
      <header className="top-bar">
        <input type="text" placeholder="Search programs, courses..." />
        <div className="user-profile">
          <img src="https://via.placeholder.com/40" alt="Profile" />
          <span>{user.firstname} {user.lastname}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Sidebar and Main Content Wrapper */}
      <div className="sidebar-main-wrapper">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Eduvoyage</h2>
          <ul>
            <li className={activeTab === 'Dashboard' ? 'active' : ''} onClick={() => setActiveTab('Dashboard')}>Dashboard</li>
            <li className={activeTab === 'Study Programs' ? 'active' : ''} onClick={() => setActiveTab('Study Programs')}>Study Programs</li>
            <li className={activeTab === 'Resources' ? 'active' : ''} onClick={() => setActiveTab('Resources')}>Resources</li>
            <li className={activeTab === 'Tasks' ? 'active' : ''} onClick={() => setActiveTab('Tasks')}>Tasks</li>
            <li className={activeTab === 'Exams' ? 'active' : ''} onClick={() => setActiveTab('Exams')}>Exams</li>
            <li className={activeTab === 'Analytics' ? 'active' : ''} onClick={() => setActiveTab('Analytics')}>Analytics</li>
            <li className={activeTab === 'Groups' ? 'active' : ''} onClick={() => setActiveTab('Groups')}>Groups</li>
            <li className={activeTab === 'Messages' ? 'active' : ''} onClick={() => setActiveTab('Messages')}>Messages</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Error Message Display */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Conditionally render content based on active tab */}
          {activeTab === 'Dashboard' && (
            <section className="dashboard">
              <div className="cards">
                <div className="card purple">
                  <h3>Study Materials</h3>
                  <p style={{ color: 'white' }}>200 Files</p>
                </div>

                <div className="card blue">
                  <h3>Apply to Colleges</h3>
                  <p style={{ color: 'white' }}>Find your ideal college!</p>
                </div>

                <div className="card orange">
                  <h3>Scholarship Opportunities</h3>
                  <p style={{ color: 'white' }}>Explore scholarships available!</p>
                </div>
              </div>

              <div className="content-row">
                <div className="class-schedule">
                  <h3>Upcoming Classes</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th>Room</th>
                        <th>Date</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>International Relations</td>
                        <td>B-201</td>
                        <td>10 Oct</td>
                        <td>09:30 AM</td>
                      </tr>
                      <tr>
                        <td>Global Economics</td>
                        <td>C-101</td>
                        <td>12 Oct</td>
                        <td>11:00 AM</td>
                      </tr>
                      <tr>
                        <td>Data Structure</td>
                        <td>A-104</td>
                        <td>14 Oct</td>
                        <td>02:00 PM</td>
                      </tr>
                      <tr>
                        <td>Artificial Intelligence</td>
                        <td>D-202</td>
                        <td>15 Oct</td>
                        <td>10:00 AM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="hours-spent">
                  <h3>Study Hours</h3>
                  <div className="chart">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="hours" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="enrollment-section">
                <h3>Enroll in Courses</h3>
                <div className="course-list">
                  {courses.map((course) => (
                    <div key={course._id} className="course-card">
                      <h4>{course.name}</h4>
                      <p>Duration: {course.duration} months</p>
                      <p>Price: ${course.price}</p>
                      <button onClick={() => enrollCourse(course)}>Enroll</button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === 'Study Programs' && (
            <section className="study-programs">
              <h2>Available Study Programs</h2>
              <div className="course-list">
                {courses.map((course) => (
                  <div key={course._id} className="course-card">
                    <h4>{course.name}</h4>
                    <p>Duration: {course.duration} months</p>
                    <p>Price: ${course.price}</p>
                    <button onClick={() => enrollCourse(course)}>Enroll</button>
                  </div>
                ))}
              </div>
            </section>
          )}
          {activeTab === 'Resources' && (
            <section className="courses-section">
              <h3>Resources</h3>
             
            </section>
          )}
          {activeTab === 'Tasks' && (
            <section className="courses-section">
              <h3>Tasks</h3>
             
            </section>
          )}
          {activeTab === 'Exams' && (
            <section className="courses-section">
              <h3>Exams</h3>
             
            </section>
          )}
          {activeTab === 'Analytics' && (
            <section className="courses-section">
              <h3>Analytics</h3>
             
            </section>
          )}
          {activeTab === 'Groups' && (
            <section className="courses-section">
              <h3>Groups</h3>
             
            </section>
          )}
          {activeTab === 'Messages' && (
            <section className="courses-section">
              <h3>Messages</h3>
             
            </section>
          )}
          {/* Modal for Enrollment */}
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Enroll in {selectedCourse?.name}</h2>
                <form onSubmit={handleSubmit}>
                  <label>
                    Salutation:
                    <input type="text" name="salutation" value={formData.salutation} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Name:
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Email:
                    <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
                  </label>
                  <label>
                    Phone:
                    <input type="tel" name="phone" value={formData.phone} onChange={handleFormChange} required />
                  </label>
                  <button type="submit">Submit Enrollment</button>
                  <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
