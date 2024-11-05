import React from 'react';
import { useLocation } from 'react-router-dom';
import StudentSidebar from '../Sidebar/StudentSidebar';
import Header from './Header';

const HelpSupport = () => {
  const location = useLocation();
  const { college } = location.state;

  const styles = {
    container: {
      flex: 1,
      padding: '80px 20px 40px',
      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      marginLeft: '250px',
    },
    header: {
      fontSize: '2.5rem',
      color: '#343a40',
      marginBottom: '40px',
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '700',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
    },
    supportSection: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '30px',
      margin: '20px 0',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
      fontSize: '1.8rem',
      color: '#2c3e50',
      marginBottom: '20px',
      borderBottom: '2px solid #e9ecef',
      paddingBottom: '10px',
    },
    contactInfo: {
      marginBottom: '30px',
    },
    infoItem: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      fontSize: '1.1rem',
      color: '#495057',
    },
    faqSection: {
      marginTop: '30px',
    },
    faqItem: {
      marginBottom: '20px',
      padding: '15px',
      borderLeft: '4px solid #007bff',
      backgroundColor: '#f8f9fa',
      borderRadius: '0 8px 8px 0',
    },
    question: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#343a40',
      marginBottom: '10px',
    },
    answer: {
      color: '#6c757d',
      lineHeight: '1.6',
    }
  };

  return (
    <div className="student-dashboard">
      <StudentSidebar />
      <div style={styles.container}>
        <Header user={{}} onLogout={() => {}} />
        <h1 style={styles.header}>{college.collegeName} - Help & Support</h1>
        
        <div style={styles.supportSection}>
          <h2 style={styles.sectionTitle}>Contact Information</h2>
          <div style={styles.contactInfo}>
            <div style={styles.infoItem}>Email: support@{college.collegeName.toLowerCase()}.edu</div>
            <div style={styles.infoItem}>Phone: {college.phone || '+1 (555) 123-4567'}</div>
            <div style={styles.infoItem}>Address: {college.address}</div>
          </div>

          <div style={styles.faqSection}>
            <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div style={styles.faqItem}>
              <div style={styles.question}>What are the admission requirements?</div>
              <div style={styles.answer}>
                Requirements vary by program. Generally, you'll need academic transcripts, 
                language proficiency test scores, and letters of recommendation.
              </div>
            </div>
            <div style={styles.faqItem}>
              <div style={styles.question}>How can I track my application status?</div>
              <div style={styles.answer}>
                You can track your application status through your student dashboard 
                or by contacting our admissions office directly.
              </div>
            </div>
            <div style={styles.faqItem}>
              <div style={styles.question}>What support services are available for international students?</div>
              <div style={styles.answer}>
                We offer visa assistance, accommodation support, cultural integration programs, 
                and academic counseling for all international students.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport; 