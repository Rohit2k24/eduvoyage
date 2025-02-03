import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "react-phone-number-input/style.css";
import { CountryDropdown } from 'react-country-region-selector';

const CollegeRegistrationForm = () => {
  const [formData, setFormData] = useState({
    collegeName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    country: "",
    contactPerson: "",
    website: "",
  });
  const [phone, setPhone] = useState("");

  const [documents, setDocuments] = useState({
    accreditationCertificate: null,
    legalDocuments: null,
    collegeImage: null
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
  
    if (file && !["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      setErrors({
        ...errors,
        [name]: "Only JPG, PNG and PDF files are allowed",
      });
    } else {
      setDocuments({ ...documents, [name]: file });
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const websiteRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    switch (name) {
      case "collegeName":
        if (!value.trim()) {
          newErrors.collegeName = "College name is required";
        } else {
          delete newErrors.collegeName;
        }
        break;
      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Email format is invalid";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (!value) {
          newErrors.password = "Password is required";
        } else if (value.length < 8) {
          newErrors.password = "Password must be at least 8 characters long";
        } else {
          delete newErrors.password;
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      case "website":
        if (value && !websiteRegex.test(value)) {
          newErrors.website = "Invalid website format";
        } else {
          delete newErrors.website;
        }
        break;
      default:
        if (!value.trim()) {
          newErrors[name] = `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
        } else {
          delete newErrors[name];
        }
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    // Validate files
    if (!documents.accreditationCertificate) {
      newErrors.accreditationCertificate = "Accreditation Certificate is required";
    }
    if (!documents.legalDocuments) {
      newErrors.legalDocuments = "Legal Documents are required";
    }
    if (!documents.collegeImage) {
      newErrors.collegeImage = "College Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) =>
          formDataToSend.append(key, formData[key])
        );
        Object.keys(documents).forEach((key) =>
          formDataToSend.append(key, documents[key])
        );

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/auth/register-college`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.status === 1) {
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
                  `${import.meta.env.VITE_BASE_URL}/api/auth/verify-college-otp`,
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
              title: "Registration Successful",
              text: "Your college registration is pending approval.",
              icon: "success",
            });
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Registration error:", error);
        Swal.fire({
          title: "Registration Failed",
          text: error.response?.data?.msg || "An error occurred during registration",
          icon: "error",
        });
      }
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "#f0f2f5",
      padding: "2rem",
    },
    form: {
      width: "100%",
      maxWidth: "600px",
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
      textAlign: "center",
      marginBottom: "2rem",
      color: "#333",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "bold",
      color: "#555",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "1rem",
    },
    errorInput: {
      borderColor: "#e74c3c",
    },
    errorMessage: {
      color: "red",
      marginTop: "0.25rem",
    },
    submitButton: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "#2ecc71",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "bold",
      transition: "background-color 0.3s ease",
    },
    fileInput: {
      border: "1px solid #ccc",
      padding: "0.5rem",
      borderRadius: "4px",
      fontSize: "0.875rem",
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>College Registration</h2>

        {Object.keys(formData).map((field) => (
          <div key={field} style={styles.formGroup}>
            <label htmlFor={field} style={styles.label}>
              {field.charAt(0).toUpperCase() +
                field.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
            {field === "country" ? (
              <CountryDropdown
                value={formData.country}
                onChange={(val) => setFormData(prev => ({ ...prev, country: val }))}
                style={{
                  ...styles.input,
                  ...(errors[field] ? styles.errorInput : {}),
                }}
              />
            ) : (
              <input
                type={
                  field.includes("password") ? "password" : "text"
                }
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  ...(errors[field] ? styles.errorInput : {}),
                }}
              />
            )}
            {errors[field] && (
              <p style={styles.errorMessage}>{errors[field]}</p>
            )}
          </div>
        ))}

        <div style={styles.formGroup}>
          <label htmlFor="accreditationCertificate" style={styles.label}>
            Accreditation Certificate
          </label>
          <input
            type="file"
            id="accreditationCertificate"
            name="accreditationCertificate"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          {errors.accreditationCertificate && (
            <p style={styles.errorMessage}>{errors.accreditationCertificate}</p>
          )}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="legalDocuments" style={styles.label}>
            Legal Documents
          </label>
          <input
            type="file"
            id="legalDocuments"
            name="legalDocuments"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          {errors.legalDocuments && (
            <p style={styles.errorMessage}>{errors.legalDocuments}</p>
          )}
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="collegeImage" style={styles.label}>
            College Image
          </label>
          <input
            type="file"
            id="collegeImage"
            name="collegeImage"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          {errors.collegeImage && (
            <p style={styles.errorMessage}>{errors.collegeImage}</p>
          )}
        </div>

        {/* { <div>
          <PhoneInput
            placeholder="Enter phone number"
            value={phone}
            onChange={setPhone}
          />
        </div> } */}

        <button
          type="submit"
          style={styles.submitButton}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#27ae60")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#2ecc71")}
        >
          Register College
        </button>
      </form>
    </div>
  );
};

export default CollegeRegistrationForm;
