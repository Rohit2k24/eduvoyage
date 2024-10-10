import { useState } from "react";
import "./RegistrationForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
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

  const validatePhone = (phone) => {
    if (phone.length !== 10) return false;
    if (phone[0] === '0') return false;
    if (/^(.)\1+$/.test(phone)) return false; // Check for repeated digits
    if (phone === '1234567890') return false;
    if (phone.startsWith('12345')) return false;
    return /^\d{10}$/.test(phone);
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
    } else if (name === 'phone') {
      setErrors({
        ...errors,
        phone: validatePhone(value) ? '' : 'Invalid phone number',
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
    } else if (name === 'phone') {
      setErrors({
        ...errors,
        phone: validatePhone(value) ? '' : 'Invalid phone number',
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
    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      if (response.data.status === 1) {
        alert("User Registered Successfully");
        navigate("/login");
      }
    } catch (error) {
      alert(error.response?.data?.msg || "Error during registration");
      console.error("Error:", error);
    }
  };

  return (
    <div className="registration-form-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>Register Form</h2>

        {Object.keys(formData).map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>
              {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            {field === "role" ? (
              <select
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="CollegeAdmin">College Admin</option>
              </select>
            ) : (
              <input
                type={
                  field === "email"
                    ? "email"
                    : field === "password" || field === "confirmPassword"
                    ? "password"
                    : field === "phone"
                    ? "tel"
                    : "text"
                }
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

        <button style={{backgroundColor:'lightblue'}} type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
