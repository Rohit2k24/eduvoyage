import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import StudentSidebar from '../Sidebar/StudentSidebar';
import SharedHeader from './SharedHeader';
import { FaBars } from 'react-icons/fa';

const ScholarshipPrograms = () => {
  const location = useLocation();
  const { college } = location.state;
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Sample scholarship data - replace with actual API call
  const scholarships = [
    {
      id: 1,
      title: 'Merit-Based Scholarship',
      amount: '50% tuition fee',
      eligibility: 'GPA 3.5 or higher',
      deadline: '2024-08-31',
      description: 'Awarded to students with exceptional academic performance.'
    },
    {
      id: 2,
      title: 'International Student Grant',
      amount: '$5,000',
      eligibility: 'International students',
      deadline: '2024-07-15',
      description: 'Financial support for international students pursuing higher education.'
    },
    {
      id: 3,
      title: 'Need-Based Aid',
      amount: 'Up to 75% tuition fee',
      eligibility: 'Demonstrated financial need',
      deadline: '2024-09-30',
      description: 'Support for students requiring financial assistance.'
    }
  ];

  const styles = {
    scholarshipCard: {
      background: '#fff',
      borderRadius: '12px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
    },
    scholarshipTitle: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '1rem',
    },
    scholarshipDetails: {
      fontSize: '1rem',
      color: '#64748b',
      marginBottom: '1rem',
      lineHeight: '1.6',
    },
    deadline: {
      color: '#dc3545',
      fontWeight: '600',
      marginBottom: '15px',
    },
    applyButton: {
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      padding: '12px 25px',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      fontSize: '1rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)',
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
          user={{}}
          onLogout={() => {}}
          title={`${college.collegeName} - Scholarships`}
          subtitle="Explore scholarship opportunities"
        />
        
        {scholarships.map((scholarship) => (
          <div
            key={scholarship.id}
            style={styles.scholarshipCard}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={styles.scholarshipTitle}>{scholarship.title}</h3>
            <p style={styles.scholarshipDetails}>
              <strong>Amount:</strong> {scholarship.amount}
            </p>
            <p style={styles.scholarshipDetails}>
              <strong>Eligibility:</strong> {scholarship.eligibility}
            </p>
            <p style={styles.deadline}>
              <strong>Application Deadline:</strong> {scholarship.deadline}
            </p>
            <p style={styles.scholarshipDetails}>{scholarship.description}</p>
            <button
              style={styles.applyButton}
              onClick={() => setSelectedScholarship(scholarship)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
            >
              Apply for Scholarship
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipPrograms; 