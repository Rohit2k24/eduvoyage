// src/components/student/StudyProgram.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';
import StudentSidebar from '../Sidebar/StudentSidebar';
import Header from './Header';

const StudyProgram = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ firstname: '', lastname: '' });
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    country: '',
    courseType: ''
  });
  
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  // Filter options
  const countries = [...new Set(colleges.map(college => college.country))];
  const courseTypes = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.collegeName.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCountry = !filters.country || college.country === filters.country;
    const matchesCourseType = !filters.courseType || college.courseTypes?.includes(filters.courseType);
    return matchesSearch && matchesCountry && matchesCourseType;
  });

  useEffect(() => {
    fetchApprovedColleges();
    // Fetch user data here and set it, e.g., setUser({ firstname: 'John', lastname: 'Doe' });
  }, []);

  const fetchApprovedColleges = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/approved-colleges`);
      console.log(response.data);
      setColleges(response.data);
    } catch (error) {
      console.error('Error fetching approved colleges:', error);
    }
  };

  const fetchOfferedCourses = async (collegeId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/offered-courses/${collegeId}`);
      setOfferedCourses(response.data);
    } catch (error) {
      console.error('Error fetching offered courses:', error);
    }
  };

  const handleCollegeClick = (college) => {
    navigate('/studentDashboard/college-details', { 
      state: { 
        college: {
          ...college,
          _id: college._id,
          collegeName: college.collegeName,
          address: college.address,
          country: college.country
        } 
      }
    });
  };

  const handleApply = (course) => {
    setSelectedCourse(course);
    setShowApplicationForm(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/logout`);
      localStorage.removeItem("token");
      localStorage.removeItem('studentId');
      localStorage.removeItem("role");
    } catch (error) {
      console.error('Error logging out:', error);
      setErrorMessage('Logout failed. Please try again.');
    }
  };

  const handleGetRecommendations = () => {
    navigate('/get-course-recommendations'); // Redirect to the recommendations page
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
    },
    mainContent: {
      flex: 1,
      padding: '32px',
      marginLeft: '250px',
      backgroundColor: '#f1f5f9',
    },
    heroSection: {
      textAlign: 'center',
      padding: '60px 0',
      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
      color: 'white',
      borderRadius: '16px',
      marginBottom: '32px',
    },
    heroTitle: {
      fontSize: '2.5rem',
      marginBottom: '16px',
      fontWeight: '700',
    },
    heroSubtitle: {
      fontSize: '1.2rem',
      opacity: '0.9',
    },
    filtersSection: {
      background: 'white',
      padding: '24px',
      borderRadius: '16px',
      marginBottom: '32px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    searchBar: {
      position: 'relative',
      marginBottom: '24px',
    },
    searchInput: {
      width: '100%',
      padding: '12px 48px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b',
    },
    filtersContainer: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    filterGroup: {
      flex: '1 1 200px',
      maxWidth: '300px',
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '0.875rem',
      color: '#1e293b',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:hover': {
        borderColor: '#2563eb',
      },
      '&:focus': {
        outline: 'none',
        borderColor: '#2563eb',
        boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
      }
    },
    viewToggle: {
      display: 'flex',
      gap: '8px',
      marginLeft: 'auto',
    },
    viewToggleButton: (isActive) => ({
      padding: '10px 16px',
      border: '1px solid #e2e8f0',
      background: isActive ? '#2563eb' : 'white',
      color: isActive ? 'white' : '#64748b',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        background: isActive ? '#2563eb' : '#f8fafc',
      }
    }),
    collegesContainer: {
      display: 'grid',
      gap: '24px',
      marginBottom: '48px',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    },
    collegeCard: {
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
      },
    },
    collegeImage: {
      position: 'relative',
      height: '200px',
    },
    collegeImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    collegeRating: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '4px 8px',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    },
    collegeInfo: {
      padding: '24px',
    },
    collegeName: {
      marginBottom: '12px',
      fontSize: '1.25rem',
      color: '#1e293b',
      fontWeight: '600',
    },
    collegeLocation: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#64748b',
      marginBottom: '16px',
    },
    collegeStats: {
      display: 'flex',
      gap: '24px',
      marginBottom: '24px',
      color: '#64748b',
    },
    viewDetailsBtn: {
      width: '100%',
      padding: '12px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: '#3b82f6',
      },
    },
    recommendationSection: {
      background: 'white',
      borderRadius: '16px',
      padding: '48px',
      textAlign: 'center',
      marginBottom: '48px',
    },
    recommendationTitle: {
      fontSize: '2rem',
      marginBottom: '16px',
      color: '#1e293b',
      fontWeight: '700',
    },
    recommendationText: {
      color: '#64748b',
      marginBottom: '24px',
    },
    recommendationBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 24px',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: '#3b82f6',
      },
    },
  };

  return (
    <div style={styles.container}>
      <StudentSidebar />
      <div style={styles.mainContent}>
        <Header user={user} onLogout={handleLogout} />
        
        <section style={styles.heroSection}>
          <h1 style={styles.heroTitle}>Find Your Perfect Study Program</h1>
          <p style={styles.heroSubtitle}>Explore top colleges and universities worldwide</p>
        </section>

        <section style={styles.filtersSection}>
          <div style={styles.searchBar}>
            <i className="fas fa-search" style={styles.searchIcon}></i>
            <input
              style={styles.searchInput}
              type="text"
              placeholder="Search colleges..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div style={styles.filtersContainer}>
            <div style={styles.filterGroup}>
              <select
                style={styles.select}
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div style={styles.filterGroup}>
              <select
                style={styles.select}
                value={filters.courseType}
                onChange={(e) => setFilters({ ...filters, courseType: e.target.value })}
              >
                <option value="">All Course Types</option>
                {courseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div style={styles.viewToggle}>
              <button 
                style={styles.viewToggleButton(viewMode === 'grid')}
                onClick={() => setViewMode('grid')}
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button 
                style={styles.viewToggleButton(viewMode === 'list')}
                onClick={() => setViewMode('list')}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </section>

        <section style={styles.collegesContainer}>
          {filteredColleges.map((college) => (
            <div key={college._id} style={styles.collegeCard} onClick={() => handleCollegeClick(college)}>
              <div style={styles.collegeImage}>
                <img 
                  src={college.imageUrl || '/default-college.jpg'} 
                  alt={college.collegeName}
                  style={styles.collegeImg}
                />
                <div style={styles.collegeRating}>
                  <i className="fas fa-star" style={{ color: '#fbbf24' }}></i>
                  <span>{college.rating || '4.5'}</span>
                </div>
              </div>
              <div style={styles.collegeInfo}>
                <h2 style={styles.collegeName}>{college.collegeName}</h2>
                <div style={styles.collegeLocation}>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{college.address}, {college.country}</span>
                </div>
                <div style={styles.collegeStats}>
                  <div>
                    <i className="fas fa-graduation-cap"></i>
                    <span>{college.programCount || '25'} Programs</span>
                  </div>
                  <div>
                    <i className="fas fa-users"></i>
                    <span>{college.studentCount || '5000'}+ Students</span>
                  </div>
                </div>
                <button style={styles.viewDetailsBtn}>View Details</button>
              </div>
            </div>
          ))}
        </section>

        <section style={styles.recommendationSection}>
          <div>
            <h2 style={styles.recommendationTitle}>Not sure what to study?</h2>
            <p style={styles.recommendationText}>
              Get personalized course recommendations based on your interests and goals
            </p>
            <button style={styles.recommendationBtn} onClick={handleGetRecommendations}>
              Get Recommendations
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </section>

        {showApplicationForm && (
          <ApplicationForm
            course={selectedCourse}
            college={selectedCollege}
            onClose={() => setShowApplicationForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default StudyProgram;
