// src/components/student/StudyProgram.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';
import StudentSidebar from '../Sidebar/StudentSidebar';
import SharedHeader from './SharedHeader';
import { FaBars, FaMapMarkerAlt, FaGraduationCap, FaUsers } from 'react-icons/fa';

const StudyProgram = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ firstname: '', lastname: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
      background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
      borderRadius: '16px',
      padding: '3.5rem 2rem',
      color: 'white',
      textAlign: 'center',
      marginBottom: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
        pointerEvents: 'none'
      }
    },
    heroTitle: {
      fontSize: '2.75rem',
      fontWeight: '700',
      marginBottom: '1.25rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      opacity: '0.95',
      maxWidth: '700px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    filtersSection: {
      background: 'white',
      borderRadius: '16px',
      padding: '1.75rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(226, 232, 240, 0.8)'
    },
    filterControls: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.25rem',
      alignItems: 'center',
      padding: '0.5rem'
    },
    searchInput: {
      width: '100%',
      padding: '0.875rem 1.25rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      fontSize: '1rem',
      backgroundColor: '#f8fafc',
      color: '#1e293b',
      transition: 'all 0.2s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        backgroundColor: '#ffffff'
      },
      '&::placeholder': {
        color: '#94a3b8'
      }
    },
    select: {
      width: '100%',
      padding: '0.875rem 1.25rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      fontSize: '1rem',
      backgroundColor: '#f8fafc',
      color: '#1e293b',
      cursor: 'pointer',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 1rem center',
      backgroundSize: '1em',
      paddingRight: '2.5rem',
      transition: 'all 0.2s ease',
      '&:focus': {
        outline: 'none',
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        backgroundColor: '#ffffff'
      },
      '&:hover': {
        borderColor: '#3b82f6',
        backgroundColor: '#ffffff'
      }
    },
    collegeGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '2rem',
      padding: '1rem 0'
    },
    collegeCard: {
      background: 'white',
      borderRadius: '16px',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }
    },
    collegeImage: {
      position: 'relative',
      height: '220px',
      overflow: 'hidden',
      backgroundColor: '#f1f5f9'
    },
    collegeImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)'
      }
    },
    collegeInfo: {
      padding: '1.75rem'
    },
    collegeName: {
      fontSize: '1.35rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '1rem',
      lineHeight: '1.4'
    },
    collegeLocation: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#64748b',
      marginBottom: '1.25rem',
      fontSize: '0.95rem'
    },
    collegeStats: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1.25rem 0',
      borderTop: '1px solid #e2e8f0',
      color: '#64748b',
      fontSize: '0.95rem'
    },
    statItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#4b5563'
    },
    viewDetailsBtn: {
      width: '100%',
      padding: '0.875rem',
      background: '#1a237e',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginTop: '1.25rem',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      '&:hover': {
        background: '#283593',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(26, 35, 126, 0.15)'
      }
    },
    recommendationSection: {
      background: 'white',
      borderRadius: '16px',
      padding: '3.5rem 2rem',
      textAlign: 'center',
      marginBottom: '3rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(226, 232, 240, 0.8)'
    },
    recommendationTitle: {
      fontSize: '2.25rem',
      marginBottom: '1.25rem',
      color: '#1e293b',
      fontWeight: '700',
      lineHeight: '1.3'
    },
    recommendationText: {
      color: '#64748b',
      marginBottom: '2rem',
      fontSize: '1.1rem',
      maxWidth: '600px',
      margin: '0 auto 2rem'
    },
    recommendationBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 2rem',
      background: '#2563eb',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '1.1rem',
      '&:hover': {
        background: '#1d4ed8',
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
      }
    }
  };

  return (
    <div className="student-dashboard">
      <div className="menu-button" onClick={toggleSidebar}>
        <FaBars />
      </div>
      
      <StudentSidebar isOpen={isSidebarOpen} />
      
      <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
        <SharedHeader 
          user={user}
          onLogout={handleLogout}
          title="Discover Your Academic Path"
          subtitle="Explore prestigious institutions and find the perfect program for your future"
        />

        <section style={styles.filtersSection}>
          <div style={styles.filterControls}>
            <input
              type="text"
              placeholder="Search for colleges..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              style={styles.searchInput}
            />

            <select
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              style={styles.select}
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            <select
              value={filters.courseType}
              onChange={(e) => setFilters({ ...filters, courseType: e.target.value })}
              style={styles.select}
            >
              <option value="">All Program Types</option>
              {courseTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </section>

        <div style={styles.collegeGrid}>
          {filteredColleges.map((college) => (
            <div 
              key={college._id} 
              style={styles.collegeCard}
              onClick={() => handleCollegeClick(college)}
            >
              <div style={styles.collegeImage}>
                <img 
                  src={`${import.meta.env.VITE_BASE_URL}/api/auth/college-image/${college.collegeName}`}
                  alt={college.collegeName}
                  style={styles.collegeImg}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/default-college.jpg';
                  }}
                />
              </div>
              <div style={styles.collegeInfo}>
                <h2 style={styles.collegeName}>{college.collegeName}</h2>
                <div style={styles.collegeLocation}>
                  <FaMapMarkerAlt />
                  <span>{college.address}, {college.country}</span>
                </div>
                <div style={styles.collegeStats}>
                  <div style={styles.statItem}>
                    <FaGraduationCap />
                    <span>{college.programCount || '25'} Programs</span>
                  </div>
                  <div style={styles.statItem}>
                    <FaUsers />
                    <span>{college.studentCount || '5000'}+ Students</span>
                  </div>
                </div>
                <button style={styles.viewDetailsBtn}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

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
