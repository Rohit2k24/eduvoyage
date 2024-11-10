import React, { useState } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import Swal from 'sweetalert2';
import { validatePhoneNumber, phoneValidationRules } from '../../utils/phoneValidation';

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

  const validations = {
    fullName: {
      pattern: /^[A-Za-z\s]+$/,
      message: 'Full name can only contain letters and spaces'
    },
    email: {
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      message: 'Please enter a valid email address'
    },
    passportnumber: {
      pattern: /^[A-Z0-9]{6,9}$/,
      message: 'Passport number must be 6-9 characters long and contain only uppercase letters and numbers'
    },
    phone: {
      validate: (value) => isValidPhoneNumber(value || ''),
      message: 'Please enter a valid phone number'
    },
    yearOfCompletion: {
      validate: (value) => {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        return year >= 1950 && year <= currentYear;
      },
      message: 'Please enter a valid year between 1950 and current year'
    },
    gpa: {
      validate: (value) => {
        const num = parseFloat(value);
        return !isNaN(num) && num >= 0 && num <= 10;
      },
      message: 'GPA must be a number between 0 and 10'
    },
    dateOfBirth: {
      validate: (value) => {
        const date = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 16 && age <= 100;
      },
      message: 'You must be at least 16 years old to apply'
    },
    nationality: {
      pattern: /^[A-Za-z\s]+$/,
      message: 'Nationality can only contain letters and spaces'
    },
    highestQualification: {
      pattern: /^[A-Za-z0-9\s\-\.]+$/,
      message: 'Please enter a valid qualification'
    },
    degreeName: {
      pattern: /^[A-Za-z0-9\s\-\.]+$/,
      message: 'Please enter a valid degree name'
    },
    institution: {
      pattern: /^[A-Za-z0-9\s\-\.&,]+$/,
      message: 'Please enter a valid institution name'
    }
  };

  const validateField = (name, value) => {
    if (!value) {
      return 'This field is required';
    }

    const validation = validations[name];
    if (!validation) return '';

    if (validation.pattern && !validation.pattern.test(value)) {
      return validation.message;
    }

    if (validation.validate && !validation.validate(value)) {
      return validation.message;
    }

    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    const error = validateField(name, value);
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = {
        'image/jpeg': true,
        'image/jpg': true,
        'image/png': true,
        'application/pdf': true
      };

      if (!validTypes[file.type]) {
        setErrors(prev => ({
          ...prev,
          percentageFile: 'Only PDF, JPEG, JPG, and PNG files are allowed'
        }));
        e.target.value = ''; // Reset file input
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          percentageFile: 'File size must be less than 5MB'
        }));
        e.target.value = ''; // Reset file input
        return;
      }

      setFormData(prevState => ({
        ...prevState,
        percentageFile: file
      }));
      setErrors(prev => ({
        ...prev,
        percentageFile: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = [
      'fullName', 'dateOfBirth', 'gender', 'nationality', 
      'email', 'phone', 'passportnumber', 'highestQualification',
      'degreeName', 'institution', 'yearOfCompletion', 'gpa', 'studyMode'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    // File validation
    if (!formData.percentageFile) {
      newErrors.percentageFile = 'Please upload your percentage document';
    }

    // Validate each field with specific rules
    if (formData.fullName && !validations.fullName.pattern.test(formData.fullName)) {
      newErrors.fullName = validations.fullName.message;
    }

    if (formData.email && !validations.email.pattern.test(formData.email)) {
      newErrors.email = validations.email.message;
    }

    if (formData.phone && !validations.phone.validate(formData.phone)) {
      newErrors.phone = validations.phone.message;
    }

    if (formData.passportnumber && !validations.passportnumber.pattern.test(formData.passportnumber)) {
      newErrors.passportnumber = validations.passportnumber.message;
    }

    if (formData.dateOfBirth && !validations.dateOfBirth.validate(formData.dateOfBirth)) {
      newErrors.dateOfBirth = validations.dateOfBirth.message;
    }

    if (formData.yearOfCompletion && !validations.yearOfCompletion.validate(formData.yearOfCompletion)) {
      newErrors.yearOfCompletion = validations.yearOfCompletion.message;
    }

    if (formData.gpa && !validations.gpa.validate(formData.gpa)) {
      newErrors.gpa = validations.gpa.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append('courseId', course._id);
    formDataToSend.append('collegeId', college._id);
    formDataToSend.append('studentId', localStorage.getItem('studentId'));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/student-enroll-course`,
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      
      Swal.fire({
        title: 'Success',
        text: 'Application submitted successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      onClose();
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response ? error.response.data.message : 'Failed to submit application. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
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
      color: '#dc3545',
      fontSize: '12px',
      marginTop: '4px',
      fontStyle: 'italic'
    },
    inputError: {
      borderColor: '#dc3545',
      boxShadow: '0 0 0 0.2rem rgba(220,53,69,.25)'
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
              style={{
                ...styles.input,
                borderColor: errors.fullName ? 'red' : '#ddd'
              }}
            />
            {errors.fullName && <span style={styles.error}>{errors.fullName}</span>}
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
              style={{
                ...styles.input,
                borderColor: errors.dateOfBirth ? 'red' : '#ddd'
              }}
            />
            {errors.dateOfBirth && <span style={styles.error}>{errors.dateOfBirth}</span>}
          </div>

          {/* Gender */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                borderColor: errors.gender ? 'red' : '#ddd'
              }}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <span style={styles.error}>{errors.gender}</span>}
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
              style={{
                ...styles.input,
                borderColor: errors.nationality ? 'red' : '#ddd'
              }}
            />
            {errors.nationality && <span style={styles.error}>{errors.nationality}</span>}
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
              style={{
                ...styles.input,
                borderColor: errors.email ? 'red' : '#ddd'
              }}
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <PhoneInput
              international
              defaultCountry="IN"
              countryCallingCodeEditable={false}
              value={formData.phone}
              onChange={(value, phoneData) => {
                if (value) {
                  try {
                    const phoneNumber = parsePhoneNumber(value);
                    if (phoneNumber) {
                      const countryCode = phoneNumber.country;
                      const rules = phoneValidationRules[countryCode] || phoneValidationRules.DEFAULT;
                      const nationalNumber = phoneNumber.nationalNumber;
                      
                      // Only update if within length limits
                      if (nationalNumber.length <= rules.maxLength) {
                        setFormData(prevState => ({
                          ...prevState,
                          phone: value
                        }));
                        
                        // Validate the number
                        const isValid = isValidPhoneNumber(value);
                        setErrors(prev => ({
                          ...prev,
                          phone: isValid ? '' : `Please enter a valid ${countryCode} phone number`
                        }));
                      }
                    }
                  } catch (error) {
                    setErrors(prev => ({
                      ...prev,
                      phone: 'Invalid phone number'
                    }));
                  }
                } else {
                  setFormData(prevState => ({
                    ...prevState,
                    phone: ''
                  }));
                  setErrors(prev => ({
                    ...prev,
                    phone: 'Phone number is required'
                  }));
                }
              }}
              required
              style={{
                ...styles.input,
                borderColor: errors.phone ? 'red' : '#ddd'
              }}
            />
            {errors.phone && <span style={styles.error}>{errors.phone}</span>}
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
              style={{
                ...styles.input,
                borderColor: errors.passportnumber ? 'red' : '#ddd'
              }}
            />
            {errors.passportnumber && <span style={styles.error}>{errors.passportnumber}</span>}
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
              style={{
                ...styles.input,
                borderColor: errors.highestQualification ? 'red' : '#ddd'
              }}
            />
            {errors.highestQualification && <span style={styles.error}>{errors.highestQualification}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Degree Name</label>
            <input
              type="text"
              name="degreeName"
              placeholder="Type Nil if not applicable"
              value={formData.degreeName}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                borderColor: errors.degreeName ? 'red' : '#ddd'
              }}
            />
            {errors.degreeName && <span style={styles.error}>{errors.degreeName}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Institution</label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                borderColor: errors.institution ? 'red' : '#ddd'
              }}
            />
            {errors.institution && <span style={styles.error}>{errors.institution}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Year of Completion</label>
            <input
              type="number"
              name="yearOfCompletion"
              value={formData.yearOfCompletion}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                borderColor: errors.yearOfCompletion ? 'red' : '#ddd'
              }}
            />
            {errors.yearOfCompletion && <span style={styles.error}>{errors.yearOfCompletion}</span>}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>GPA</label>
            <input
              type="text"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                borderColor: errors.gpa ? 'red' : '#ddd'
              }}
            />
            {errors.gpa && <span style={styles.error}>{errors.gpa}</span>}
          </div>

          {/* File Upload for Percentage */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Upload GPA Document (PDF, JPEG, JPG, PNG only)</label>
            <input
              type="file"
              accept=".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png"
              onChange={handleFileChange}
              required
              style={{
                ...styles.input,
                borderColor: errors.percentageFile ? 'red' : '#ddd'
              }}
            />
            {formData.percentageFile && (
              <p style={styles.fileInfo}>Selected file: {formData.percentageFile.name}</p>
            )}
            {errors.percentageFile && <span style={styles.error}>{errors.percentageFile}</span>}
          </div>

          {/* Study Mode */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Study Mode</label>
            <select
              name="studyMode"
              value={formData.studyMode}
              onChange={handleChange}
              required
              style={{
                ...styles.input,
                borderColor: errors.studyMode ? 'red' : '#ddd'
              }}
            >
              <option value="">Select</option>
              <option value="full-time">Offline</option>
              <option value="part-time">Online</option>
            </select>
            {errors.studyMode && <span style={styles.error}>{errors.studyMode}</span>}
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
