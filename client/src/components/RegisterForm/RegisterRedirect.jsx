import React from 'react';
import { Link } from 'react-router-dom';

const RegisterRedirect = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f4f8',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '2rem',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '2rem',
  };

  const buttonStyle = {
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const studentButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3498db',
    color: 'white',
  };

  const collegeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2ecc71',
    color: 'white',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Choose Registration Type</h1>
      <div style={buttonContainerStyle}>
        <Link to="/register">
          <button style={studentButtonStyle}>Register as Student</button>
        </Link>
        <Link to="/college-register">
          <button style={collegeButtonStyle}>Register as College</button>
        </Link>
      </div>
    </div>
  );
};

export default RegisterRedirect;
