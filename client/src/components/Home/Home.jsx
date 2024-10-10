// src/Home.jsx
import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from '../Header/Header';
import Advertisement from '../Home/Advertisement'; // Import the advertisement component

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Simulating data fetching
    const fetchCourses = async () => {
      // Simulating a delay
      setTimeout(() => {
        setCourses(['Course 1', 'Course 2', 'Course 3', 'Course 4']);
        setLoading(false);
      }, 2000); // 2 seconds delay for loading simulation
    };

    fetchCourses();
  }, []);

  return (
    <div className="home-page">  
      <Header />

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <div className="home-container">
          <section className="hero">
            <h1>Welcome to EduVoyage</h1>
            <p>Your gateway to global education and opportunities abroad.</p>
            <button className="explore-button">Explore Now</button>
          </section>

          {/* Add Advertisement Section */}
          <section className="advertisement">
            <Advertisement />
          </section>

          <section className="features">
            <div className="feature">
              <h2>Explore Courses</h2>
              <p>Find the best programs to kickstart your international academic journey.</p>
              <ul className="course-list">
                {courses.map((course, index) => (
                  <li key={index}>{course}</li>
                ))}
              </ul>
            </div>
            <div className="feature">
              <h2>Connect with Universities</h2>
              <p>Discover top universities and get direct assistance with admissions.</p>
            </div>
            <div className="feature">
              <h2>Plan Your Study Abroad</h2>
              <p>Get expert guidance on scholarships, visas, and cultural integration.</p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Home;
