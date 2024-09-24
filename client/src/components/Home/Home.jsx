// src/Home.jsx
import React, { useState, useEffect } from 'react';
import './Home.css';
import Header from '../Header/Header';
import Advertisement from '../Home/Advertisement'; // Import the advertisement component

const Home = () => {
  const [courses, setCourses] = useState([]);

  return (
    <div className="head">  
      <Header />

      <div className="home-container">
        <main>
          <section className="hero">
            <h1>Welcome to EduVoyage</h1>
            <p>Your gateway to global education and opportunities abroad.</p>
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
        </main>
      </div>
    </div>
  );
};

export default Home;
