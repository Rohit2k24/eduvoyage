import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import StudentSidebar from '../Sidebar/StudentSidebar';
import Header from './Header';
import courseimg from '../../assets/course.jpg'
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null);
  const [selectedCourseNotes, setSelectedCourseNotes] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [viewedNotes, setViewedNotes] = useState(new Set());
  const navigate = useNavigate();

  const DEFAULT_IMAGE = '../../assets/course.jpg'; // Make sure this image exists in your public folder

  useEffect(() => {
    const checkAuthAndFetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const studentId = localStorage.getItem('studentId');
        
        console.log('Raw studentId from localStorage:', studentId);

        if (!token || !studentId) {
          console.log('Missing auth data - redirecting to login');
          navigate('/login');
          return;
        }

        setUser({ id: studentId });
        await fetchMyCourses(studentId);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      }
    };

    checkAuthAndFetchCourses();
  }, [navigate]);

  const fetchMyCourses = async (studentId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!studentId) {
        console.error('No studentId provided');
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/student/my-courses/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Received courses:', response.data);

      const validCourses = response.data.map(course => ({
        ...course,
        name: course.name || 'Untitled Course',
        courseId: course.courseId || 'no id',
        imageUrl: DEFAULT_IMAGE,
        collegeName: course.collegeName || 'Unknown College',
        status: course.status || 'pending',
        progress: course.progress || 0,
        duration: course.duration || 'N/A',
        description: course.description || 'No description available'
      }));

      console.log('Processed courses:', validCourses);
      setCourses(validCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseNotes = async (courseId) => {
    try {
      console.log("Fetching notes for courseId:", courseId); // Debug log
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/course-notes/${courseId._id}`);
      console.log("Received notes:", response.data); // Debug log
      setSelectedCourseNotes(response.data);
      setShowNotesModal(true);
    } catch (error) {
      console.error('Error fetching course notes:', error);
      // Add user feedback
      alert('Unable to fetch course notes. Please try again.');
    }
  };

  const handleCourseClick = (courseId) => {
    console.log("Course clicked with ID:", courseId); // Debug log
    if (!courseId) {
      console.error("No course ID provided");
      return;
    }
    fetchCourseNotes(courseId);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage items
    navigate('/login');
  };

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.name && 
        course.name.toLowerCase().includes((searchTerm || '').toLowerCase());
      const matchesTab = activeTab === 'all' || 
        (course.status || '').toLowerCase() === activeTab.toLowerCase();
      return matchesSearch && matchesTab;
    });
  }, [courses, searchTerm, activeTab]);

  const CourseCard = React.memo(({ course }) => (
    <div style={styles.courseCard}>
      <div style={styles.imageContainer}>
        <img
          src={course.imageUrl}
          alt={course.name}
          style={styles.courseImage}
          onError={(e) => {
            if (e.target.src !== DEFAULT_IMAGE) {
              e.target.src = DEFAULT_IMAGE;
            }
          }}
        />
      </div>
      <div style={styles.courseContent}>
        <h3 style={styles.courseName}>{course.name}</h3>
        <div style={styles.courseCollege}>
          <i className="fas fa-university"></i>
          <span>{course.collegeName}</span>
        </div>
        <div style={styles.progressBar}>
          <div style={styles.progressFill(course.progress)}></div>
        </div>
        <div style={styles.courseStats}>
          <span>{course.progress}% Complete</span>
          <span style={styles.courseStatus(course.status)}>
            {course.status}
          </span>
        </div>
      </div>
    </div>
  ));

  const updateCourseProgress = async (courseId, progress) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/update-course-progress`,
        {
          courseId: courseId._id,
          studentId: user.id,
          progress
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.courseId?._id === courseId._id 
            ? { ...course, progress }
            : course
        )
      );
    } catch (error) {
      console.error('Error updating course progress:', error);
    }
  };

  const handleNoteClick = async (note, courseId, totalNotes) => {
    try {
      // Add the note to viewed notes
      const newViewedNotes = new Set(viewedNotes);
      newViewedNotes.add(note._id);
      setViewedNotes(newViewedNotes);

      // Calculate progress based on viewed notes
      const viewedCount = Array.from(newViewedNotes)
        .filter(noteId => 
          selectedCourseNotes.some(courseNote => 
            courseNote._id === noteId
          )
        ).length;

      const progress = Math.round((viewedCount / totalNotes) * 100);
      console.log('Calculated progress:', progress);

      // Update course progress
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/update-course-progress`,
        {
          courseId: courseId,
          studentId: user.id,
          progress
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Update local state
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.courseId._id === courseId 
            ? { ...course, progress }
            : course
        )
      );

      // If all notes are viewed, update course status to completed
      if (progress === 100) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/update-course-status`,
          {
            courseId: courseId,
            studentId: user.id,
            status: 'completed'
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        // Update local state with completed status
        setCourses(prevCourses => 
          prevCourses.map(course => 
            course.courseId._id === courseId 
              ? { ...course, status: 'completed' }
              : course
          )
        );
      }

      // Refresh courses to get updated data
      await fetchMyCourses(user.id);

    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const updateCourseStatus = async (courseId, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/update-course-status`,
        {
          courseId,
          studentId: user.id,
          status
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { ...course, status }
            : course
        )
      );
    } catch (error) {
      console.error('Error updating course status:', error);
    }
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
    header: {
      marginBottom: '32px',
    },
    headerTitle: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px',
    },
    headerSubtitle: {
      color: '#64748b',
      fontSize: '1.1rem',
    },
    controls: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      flexWrap: 'wrap',
    },
    searchBar: {
      flex: '1',
      minWidth: '280px',
      position: 'relative',
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px 12px 48px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#64748b',
    },
    tabs: {
      display: 'flex',
      gap: '8px',
    },
    tab: (isActive) => ({
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      background: isActive ? '#2563eb' : '#fff',
      color: isActive ? '#fff' : '#64748b',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'all 0.2s ease',
    }),
    courseGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
    },
    courseCard: {
      background: '#fff',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s ease',
    },
    courseImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
    },
    courseContent: {
      padding: '24px',
    },
    courseName: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '8px',
    },
    courseCollege: {
      color: '#64748b',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    progressBar: {
      height: '8px',
      background: '#e2e8f0',
      borderRadius: '4px',
      marginBottom: '16px',
    },
    progressFill: (progress) => ({
      height: '100%',
      width: `${progress}%`,
      background: '#2563eb',
      borderRadius: '4px',
      transition: 'width 0.3s ease',
    }),
    courseStats: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#64748b',
      fontSize: '0.875rem'
    },
    courseStatus: (status) => ({
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '0.875rem',
      fontWeight: '500',
      background: status === 'active' ? '#dcfce7' : '#f1f5f9',
      color: status === 'active' ? '#166534' : '#475569'
    }),
    loadingState: {
      textAlign: 'center',
      padding: '48px',
      color: '#64748b',
    },
    imageContainer: {
      width: '100%',
      height: '180px',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#f3f4f6', // Light gray background for loading state
    },
    courseImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '80%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflow: 'auto'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    closeButton: {
      fontSize: '24px',
      cursor: 'pointer',
      padding: '5px',
      color: '#666'
    },
    notesList: {
      listStyle: 'none',
      padding: 0
    },
    noteItem: {
      margin: '10px 0',
      padding: '10px',
      borderRadius: '4px',
      backgroundColor: '#f5f5f5'
    },
    noteLink: {
      textDecoration: 'none',
      color: '#007bff',
      display: 'block',
      padding: '5px'
    },
    noNotes: {
      textAlign: 'center',
      color: '#666'
    },
    viewedIcon: {
      color: '#28a745',
      marginLeft: '5px'
    }
  };

  return (
    <div style={styles.container}>
      <StudentSidebar activeTab="My Courses" />
      <div style={styles.mainContent}>
        
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>My Courses</h1>
          <p style={styles.headerSubtitle}>Manage and track your enrolled courses</p>
        </div>

        <div style={styles.controls}>
          <div style={styles.searchBar}>
            <i className="fas fa-search" style={styles.searchIcon}></i>
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.tabs}>
            <button
              style={styles.tab(activeTab === 'all')}
              onClick={() => setActiveTab('all')}
            >
              All Courses
            </button>
            <button
              style={styles.tab(activeTab === 'active')}
              onClick={() => setActiveTab('active')}
            >
              Active
            </button>
            <button
              style={styles.tab(activeTab === 'completed')}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingState}>
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading your courses...</p>
          </div>
        ) : (
          <div style={styles.courseGrid}>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  onClick={() => handleCourseClick(course.courseId)}
                  style={{ cursor: 'pointer' }} // Add cursor pointer to show it's clickable
                >
                  <CourseCard course={course} />
                </div>
              ))
            ) : (
              <div style={styles.loadingState}>
                <i className="fas fa-folder-open" style={{ fontSize: '2rem', marginBottom: '16px' }}></i>
                <p>No courses found</p>
              </div>
            )}
          </div>
        )}

        {showNotesModal && (
          <div className="modal" style={styles.modal}>
            <div className="modal-content" style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2>Course Notes</h2>
                <span 
                  className="close" 
                  onClick={() => setShowNotesModal(false)}
                  style={styles.closeButton}
                >
                  &times;
                </span>
              </div>
              {selectedCourseNotes.length > 0 ? (
                <ul style={styles.notesList}>
                  {selectedCourseNotes.map(note => (
                    <li key={note._id} style={styles.noteItem}>
                      <a 
                        href={`${import.meta.env.VITE_BASE_URL}/uploads/course-notes/${note.fileName}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          ...styles.noteLink,
                          color: viewedNotes.has(note._id) ? '#28a745' : '#007bff'
                        }}
                        onClick={() => handleNoteClick(
                          note, 
                          note.courseId, 
                          selectedCourseNotes.length
                        )}
                      >
                        {note.title}
                        {viewedNotes.has(note._id) && 
                          <span style={styles.viewedIcon}> ✓</span>
                        }
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={styles.noNotes}>No notes available for this course.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;