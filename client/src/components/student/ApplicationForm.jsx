import React, { useState } from 'react';
import axios from 'axios';
import { isValid, subYears } from 'date-fns';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
// import { CountryDropdown } from 'react-country-region-selector';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';

const ApplicationForm = ({ course, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    email: '',
    phone: '',
    identification: '',
    previousEducation: '',
    academicTranscripts: null,
    englishProficiencyScore: '',
    preferredStartDate: '',
    studyMode: '',
    fundingSource: '',
    scholarshipApplication: null,
  });

  const [errors, setErrors] = useState({});

  const validateFullName = (name) => {
    const regex = /^[a-zA-Z\s.]+$/;
    return regex.test(name) ? '' : 'Full name should only contain letters, spaces, and dots.';
  };

  const validateDateOfBirth = (dob) => {
    const date = new Date(dob);
    const eighteenYearsAgo = subYears(new Date(), 18);
    return isValid(date) && date <= eighteenYearsAgo ? '' : 'You must be at least 18 years old.';
  };

  const validateNationality = (nationality) => {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(nationality) ? '' : 'Nationality should only contain letters and spaces.';
  };

  const validatePhone = (phone, country) => {
    if (!phone) return 'Phone number is required';
    
    try {
      const phoneNumber = parsePhoneNumber(phone, country);
      if (!phoneNumber) return 'Invalid phone number';
      
      if (!isValidPhoneNumber(phone, country)) {
        return 'Invalid phone number for the selected country';
      }
      
      const expectedLength = phoneNumber.countryCallingCode.length + phoneNumber.nationalNumber.length;
      const actualLength = phone.replace(/\D/g, '').length;
      
      if (actualLength !== expectedLength) {
        return `Phone number should be ${expectedLength - phoneNumber.countryCallingCode.length} digits for ${country}`;
      }
      
      return '';
    } catch (error) {
      return 'Invalid phone number';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    let error = '';
    switch (name) {
      case 'fullName':
        error = validateFullName(value);
        break;
      case 'dateOfBirth':
        error = validateDateOfBirth(value);
        break;
      case 'nationality':
        error = validateNationality(value);
        break;
      case 'phone':
        error = validatePhone(value, formData.countryOfResidence);
        break;
      // Add more validations for other fields as needed
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some(error => error !== '')) {
      alert('Please correct the errors before submitting.');
      return;
    }
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      formDataToSend.append('courseId', course._id);

      await axios.post('http://localhost:5000/api/apply', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Application submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    form: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '80vh',
      overflowY: 'auto',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
    },
    inputGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
    },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '5px',
      border: '1px solid #ddd',
    },
    error: {
      color: 'red',
      fontSize: '12px',
      marginTop: '5px',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      fontSize: '24px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '20px',
    },
    cancelButton: {
      backgroundColor: '#e74c3c',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      width: '48%',
    },
    submitButton: {
      backgroundColor: '#3498db',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      width: '48%',
    },
  };

  return (
    <div style={styles.overlay}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <button onClick={onClose} style={styles.closeButton}>&times;</button>
        <h2 style={styles.title}>Application for {course.courseName}</h2>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Full Name</label>
          <input type="text" name="fullName" onChange={handleChange} required style={styles.input} />
          {errors.fullName && <span style={styles.error}>{errors.fullName}</span>}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Date of Birth</label>
          <input type="date" name="dateOfBirth" onChange={handleChange} required style={styles.input} />
          {errors.dateOfBirth && <span style={styles.error}>{errors.dateOfBirth}</span>}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Gender</label>
          <select name="gender" onChange={handleChange} required style={styles.input}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* <div style={styles.inputGroup}>
          <label style={styles.label}>Country of Residence</label>
          <CountryDropdown
            value={formData.countryOfResidence}
            onChange={(val) => setFormData(prev => ({ ...prev, countryOfResidence: val }))}
            style={styles.input}
          />
        </div> */}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Nationality</label>
          <input type="text" name="nationality" onChange={handleChange} required style={styles.input} />
          {errors.nationality && <span style={styles.error}>{errors.nationality}</span>}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input type="email" name="email" onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Phone</label>
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry={formData.countryOfResidence}
            value={formData.phone}
            onChange={(value) => {
              setFormData(prev => ({ ...prev, phone: value }));
              setErrors(prev => ({ ...prev, phone: validatePhone(value, formData.countryOfResidence) }));
            }}
            onCountryChange={(country) => {
              setFormData(prev => ({ ...prev, countryOfResidence: country }));
              setErrors(prev => ({ ...prev, phone: validatePhone(formData.phone, country) }));
            }}
            style={styles.input}
          />
          {errors.phone && <span style={styles.error}>{errors.phone}</span>}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Identification (Passport/ID number)</label>
          <input type="text" name="identification" onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Previous Education</label>
          <textarea name="previousEducation" onChange={handleChange} required style={styles.input}></textarea>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Academic Transcripts</label>
          <input type="file" name="academicTranscripts" onChange={handleFileChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>English Proficiency Score (if applicable)</label>
          <input type="text" name="englishProficiencyScore" onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Preferred Start Date</label>
          <input type="date" name="preferredStartDate" onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Study Mode</label>
          <select name="studyMode" onChange={handleChange} required style={styles.input}>
            <option value="">Select Study Mode</option>
            <option value="onCampus">On Campus</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Funding Source</label>
          <select name="fundingSource" onChange={handleChange} required style={styles.input}>
            <option value="">Select Funding Source</option>
            <option value="selfFunded">Self-funded</option>
            <option value="scholarship">Scholarship</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Scholarship Application (if applicable)</label>
          <input type="file" name="scholarshipApplication" onChange={handleFileChange} style={styles.input} />
        </div>

        <div style={styles.buttonGroup}>
          <button type="button" onClick={onClose} style={styles.cancelButton}>Cancel</button>
          <button type="submit" style={styles.submitButton}>Submit Application</button>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
