import React, { useState } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber } from 'libphonenumber-js';

const ApplicationForm = ({ course, onClose, college }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    passportnumber: '',
    academicBackground: '',
    highestQualification: '',
    degreeName: '',
    institution: '',
    yearOfCompletion: '',
    gpa: '',
    studyMode: '',
    percentageFile: null, 
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Email validation
    if (name === 'email' && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Invalid email format',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  // New handler for file uploads
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({
      ...prevState,
      percentageFile: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = localStorage.getItem('studentId');
    if (Object.values(errors).some((error) => error !== '')) {
      alert('Please correct the errors before submitting.');
      return;
    }

    // Create FormData to include the file in the request
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append('courseId', course._id);
    formDataToSend.append('collegeId', college._id);
    formDataToSend.append('studentId', studentId );

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/student-enroll-course',
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } } // Change content type to multipart
      );
      alert('Application submitted successfully!');
      onClose();
    } catch (error) {
      alert(
        `Failed to submit application. ${
          error.response ? error.response.data.message : 'Please try again.'
        }`
      );
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    formContainer: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      width: '80%',
      maxWidth: '600px',
      maxHeight: '80vh',
      overflowY: 'auto',
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      fontSize: '20px',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
    },
    title: {
      fontSize: '24px',
      textAlign: 'center',
      marginBottom: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '10px',
    },
    label: {
      fontSize: '14px',
      marginBottom: '5px',
    },
    input: {
      padding: '8px',
      fontSize: '14px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    error: {
      color: 'red',
      fontSize: '12px',
      marginTop: '5px',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    cancelButton: {
      padding: '10px 20px',
      backgroundColor: '#ccc',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    submitButton: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.formContainer}>
        <button onClick={onClose} style={styles.closeButton}>
          &times;
        </button>
        <h2 style={styles.title}>Application for {course.courseName}</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Date of Birth */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Gender */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Nationality */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Contact Information */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input  
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <PhoneInput
              international
              defaultCountry="US"
              value={formData.phone}
              onChange={(phone) =>
                setFormData((prevState) => ({
                  ...prevState,
                  phone,
                }))
              }
              required
            />
          </div>

          {/* Identification Number */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Passport Number</label>
            <input
              type="text"
              name="passportnumber"
              value={formData.passportnumber}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* Previous Education Section */}
          <h3>Previous Education</h3>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Highest Qualification</label>
            <input
              type="text"
              name="highestQualification"
              value={formData.highestQualification}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Degree Name</label>
            <input
              type="text"
              name="degreeName"
              value={formData.degreeName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Institution</label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Year of Completion</label>
            <input
              type="number"
              name="yearOfCompletion"
              value={formData.yearOfCompletion}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Percentage/GPA</label>
            <input
              type="text"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          {/* File Upload for Percentage */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Upload Percentage Document</label>
            <input
              type="file"
              accept="application/pdf,image/*" // Accept PDF or images
              onChange={handleFileChange}
              required
            />
            {formData.percentageFile && (
              <p>File Selected: {formData.percentageFile.name}</p>
            )}
          </div>

          {/* Study Mode */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Study Mode</label>
            <select
              name="studyMode"
              value={formData.studyMode}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Select</option>
              <option value="full-time">Offline</option>
              <option value="part-time">Online</option>
            </select>
          </div>

          {/* Button Group */}
          <div style={styles.buttonGroup}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
