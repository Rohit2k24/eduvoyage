import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { CountryDropdown } from 'react-country-region-selector';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    country: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateName = (name) => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Live validation
    if (name === 'firstName' || name === 'lastName' || name === 'country') {
      setErrors({
        ...errors,
        [name]: validateName(value) ? '' : 'Should only contain letters',
      });
    } else if (name === 'email') {
      setErrors({
        ...errors,
        email: validateEmail(value) ? '' : 'Invalid email format',
      });
    } else if (name === 'password') {
      setErrors({
        ...errors,
        password: validatePassword(value) ? '' : 'Password must be at least 8 characters long',
        confirmPassword: validateConfirmPassword(value, formData.confirmPassword) ? '' : 'Passwords do not match',
      });
    } else if (name === 'confirmPassword') {
      setErrors({
        ...errors,
        confirmPassword: validateConfirmPassword(formData.password, value) ? '' : 'Passwords do not match',
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'firstName' || name === 'lastName' || name === 'country') {
      setErrors({
        ...errors,
        [name]: validateName(value) ? '' : 'Should only contain letters',
      });
    } else if (name === 'email') {
      setErrors({
        ...errors,
        email: validateEmail(value) ? '' : 'Invalid email format',
      });
    } else if (name === 'password') {
      setErrors({
        ...errors,
        password: validatePassword(value) ? '' : 'Password must be at least 8 characters long',
      });
    } else if (name === 'confirmPassword') {
      setErrors({
        ...errors,
        confirmPassword: validateConfirmPassword(formData.password, value) ? '' : 'Passwords do not match',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {};
    if (!validateName(formData.firstName)) {
      newErrors.firstName = 'First name should only contain letters';
    }
    if (!validateName(formData.lastName)) {
      newErrors.lastName = 'Last name should only contain letters';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    if (!validateConfirmPassword(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!validateName(formData.country)) {
      newErrors.country = 'Country should only contain letters';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      if (response.data.status === 1) {
        Swal.fire({
          title: "Registered Successfully",
          icon: "success"
        });
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.msg || "Error during registration");
      console.error("Error:", error);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f2f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      <form className="registration-form" onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#333',
          marginBottom: '1.5rem',
          fontSize: '24px'
        }}>Register Form</h2>

        {Object.keys(formData).map((field) => (
          <div className="form-group" key={field} style={{marginBottom: '1rem'}}>
            <label htmlFor={field} style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#555',
              fontSize: '14px'
            }}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            {field === "country" ? (
              <CountryDropdown
                value={formData.country}
                onChange={(val) => setFormData(prev => ({ ...prev, country: val }))}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            ) : field === "role" ? (
              <select
                id={field}
                name={field}
                value={formData.role}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              >
                <option value="">Select Field</option>
                <option value="Student">Student</option>
              </select>
            ) : (
              <input
                type={field === "email" ? "email" : field === "password" || field === "confirmPassword" ? "password" : "text"}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '16px'
                }}
              />
            )}
            {errors[field] && <span className="error-message" style={{
              color: 'red',
              fontSize: '12px',
              marginTop: '0.25rem',
              display: 'block'
            }}>{errors[field]}</span>}
          </div>
        ))}

        <button type="submit" style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'background-color 0.3s'
        }}>Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
