import React, { useEffect, useState } from 'react';
import StudentSidebar from '../Sidebar/StudentSidebar';
import axios from 'axios';

const Exams = () => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [examResult, setExamResult] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [completedExams, setCompletedExams] = useState(new Set());

  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  const fetchCompletedCourses = async () => {
    try {
      const studentId = localStorage.getItem('studentId');
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/student/completed-courses/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data && Array.isArray(response.data)) {
        // Get certificates to check which exams are completed
        const certificatesResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/student/certificates/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        const completedExamIds = new Set(
          certificatesResponse.data.map(cert => cert.courseId._id)
        );
        
        setCompletedExams(completedExamIds);
        setCompletedCourses(response.data);
      } else {
        console.warn('No completed courses found');
        setCompletedCourses([]);
      }
    } catch (error) {
      console.error('Error fetching completed courses:', error);
      setCompletedCourses([]);
    }
  };

  const startExam = async (courseId) => {
    try {
      if (completedExams.has(courseId)) {
        alert('You have already taken this exam.');
        return;
      }

      console.log('Starting exam for course:', courseId);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/exam/questions/${courseId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setQuestions(response.data);
      setSelectedCourse(courseId);
      setExamStarted(true);
    } catch (error) {
      console.error('Error fetching exam questions:', error);
      alert('Failed to load exam questions. Please try again.');
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const submitExam = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/exam/submit`,
        {
          courseId: selectedCourse,
          studentId: localStorage.getItem('studentId'),
          answers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setExamResult(response.data);
      setExamStarted(false);
      setCompletedExams(prev => new Set([...prev, selectedCourse]));
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Failed to submit exam. Please try again.');
    }
  };

  const downloadCertificate = async (certificateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/exam/certificate/${certificateId}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/pdf'
          }
        }
      );

      // Create and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  const styles = {
    container: {
      flex: 1,
      padding: '2rem',
      marginLeft: '250px', // Width of sidebar
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      boxSizing: 'border-box'
    },
    header: {
      color: '#2c3e50',
      marginBottom: '2rem',
      fontSize: '2.2rem',
      borderBottom: '2px solid #3498db',
      paddingBottom: '0.5rem'
    },
    courseList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      padding: '1rem 0'
    },
    courseCard: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s ease',
      border: '1px solid #e1e8ed',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    },
    startButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '0.8rem 1.5rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.2s ease',
      width: '100%',
      marginTop: '1rem',
      '&:hover': {
        backgroundColor: '#2980b9'
      }
    },
    examContainer: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '800px',
      margin: '0 auto'
    },
    instructions: {
      backgroundColor: '#f8f9fa',
      padding: '1.5rem',
      borderRadius: '8px',
      marginBottom: '2rem',
      borderLeft: '4px solid #3498db',
      listStyle: 'none'
    },
    questions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    questionCard: {
      backgroundColor: '#fff',
      padding: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #e1e8ed',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    option: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.8rem',
      marginTop: '0.5rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: '#e9ecef'
      }
    },
    submitButton: {
      backgroundColor: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      marginTop: '2rem',
      width: '100%',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: '#27ae60'
      }
    },
    resultContainer: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    },
    resultStatus: {
      fontSize: '1.5rem',
      marginTop: '1rem',
      color: '#2c3e50'
    },
    certificateButton: {
      backgroundColor: '#f1c40f',
      color: '#2c3e50',
      border: 'none',
      padding: '1rem 2rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1.1rem',
      marginTop: '2rem',
      transition: 'background-color 0.2s ease',
      '&:hover': {
        backgroundColor: '#f39c12'
      }
    },
    courseTitle: {
      color: '#2c3e50',
      marginBottom: '1rem',
      fontSize: '1.3rem'
    },
    instructionItem: {
      padding: '0.5rem 0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#2c3e50'
    },
    score: {
      fontSize: '3rem',
      color: '#2c3e50',
      marginBottom: '1rem'
    },
    questionNumber: {
      color: '#3498db',
      marginRight: '0.5rem'
    },
    questionText: {
      fontSize: '1.1rem',
      color: '#2c3e50',
      marginBottom: '1rem'
    },
    attendedButton: {
      backgroundColor: '#95a5a6',
      color: 'white',
      border: 'none',
      padding: '0.8rem 1.5rem',
      borderRadius: '5px',
      fontSize: '1rem',
      width: '100%',
      marginTop: '1rem',
      cursor: 'default'
    }
  };

  return (
    <div className="student-dashboard" style={{ display: 'flex' }}>
      <StudentSidebar />
      <div style={styles.container}>
        <h1 style={styles.header}>Exams</h1>
        
        {!examStarted && !examResult && (
          <div style={styles.courseList}>
            <h2 style={styles.courseTitle}>Available Exams</h2>
            {completedCourses.map(course => (
              <div key={course.courseId} style={styles.courseCard}>
                <h3 style={styles.courseTitle}>{course.name}</h3>
                <p style={styles.courseDescription}>
                  {course.description}
                </p>
                <div style={styles.courseInfo}>
                  <span>College: {course.collegeName}</span>
                  <span>Completed on: {new Date(course.completionDate).toLocaleDateString()}</span>
                </div>
                <button 
                  onClick={() => startExam(course.courseId)}
                  style={{
                    ...styles.startButton,
                    backgroundColor: completedExams.has(course.courseId) ? '#95a5a6' : '#3498db',
                    cursor: completedExams.has(course.courseId) ? 'default' : 'pointer'
                  }}
                  disabled={completedExams.has(course.courseId)}
                >
                  {completedExams.has(course.courseId) ? 'Attended' : 'Start Exam'}
                </button>
              </div>
            ))}
          </div>
        )}

        {examStarted && (
          <div style={styles.examContainer}>
            <h2 style={styles.courseTitle}>Exam Instructions</h2>
            <ul style={styles.instructions}>
              {['This exam contains 10 multiple choice questions',
                'Each question carries equal marks',
                'You need 50% to pass the exam',
                'You cannot go back once you submit'
              ].map((instruction, index) => (
                <li key={index} style={styles.instructionItem}>
                  <span style={{ color: '#3498db' }}>•</span> {instruction}
                </li>
              ))}
            </ul>

            <div style={styles.questions}>
              {questions.map((question, index) => (
                <div key={question._id} style={styles.questionCard}>
                  <p style={styles.questionText}>
                    <span style={styles.questionNumber}>Q{index + 1}:</span> 
                    {question.text}
                  </p>
                  {question.options.map(option => (
                    <label key={option} style={styles.option}>
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        onChange={() => handleAnswerSelect(question._id, option)}
                        style={{ marginRight: '10px' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ))}
            </div>

            <button 
              onClick={submitExam}
              style={styles.submitButton}
            >
              Submit Exam
            </button>
          </div>
        )}

        {examResult && (
          <div style={styles.resultContainer}>
            <h2 style={styles.courseTitle}>Exam Results</h2>
            <div style={styles.score}>{examResult.score}%</div>
            <p style={{
              ...styles.resultStatus,
              color: examResult.passed ? '#27ae60' : '#e74c3c'
            }}>
              {examResult.passed ? 'Congratulations! You Passed!' : 'Sorry, you did not pass.'}
            </p>
            {examResult.passed && (
              <button 
                onClick={() => downloadCertificate(examResult.certificateId)}
                style={styles.certificateButton}
              >
                Download Certificate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;
