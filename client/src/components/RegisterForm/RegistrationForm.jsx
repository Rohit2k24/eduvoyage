import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { CountryDropdown } from 'react-country-region-selector';
import './RegistrationForm.css';

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

  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");

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
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, formData);
      if (response.data.status === 1) {
        setRegisteredEmail(response.data.email);
        // Show OTP input dialog
        const { value: otpInput } = await Swal.fire({
          title: 'Enter OTP',
          text: 'Please check your email for the OTP',
          input: 'text',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Verify',
          showLoaderOnConfirm: true,
          preConfirm: async (inputValue) => {
            try {
              const verifyResponse = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/auth/verify-otp`,
                {
                  email: response.data.email,
                  otp: inputValue
                }
              );
              if (verifyResponse.data.status === 1) {
                return verifyResponse.data;
              }
              throw new Error(verifyResponse.data.msg || 'Invalid OTP');
            } catch (error) {
              Swal.showValidationMessage(
                error.response?.data?.msg || 'Invalid OTP'
              );
            }
          },
          allowOutsideClick: () => !Swal.isLoading()
        });

        if (otpInput) {
          Swal.fire({
            title: 'Success!',
            text: 'Registration completed successfully',
            icon: 'success'
          });
          navigate("/login");
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.msg || "Error during registration",
        icon: 'error'
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="registration-form">
      <form onSubmit={handleSubmit}>
        <h2>Register Form</h2>

        {Object.keys(formData).map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            {field === "country" ? (
              <CountryDropdown
                value={formData.country}
                onChange={(val) => setFormData(prev => ({ ...prev, country: val }))}
                className="country-dropdown"
              />
            ) : field === "role" ? (
              <select
                id={field}
                name={field}
                value={formData.role}
                onChange={handleChange}
                required
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
              />
            )}
            {errors[field] && <span className="error-message">{errors[field]}</span>}
          </div>
        ))}

        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;