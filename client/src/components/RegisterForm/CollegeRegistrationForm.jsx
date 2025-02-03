import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "react-phone-number-input/style.css";
import { CountryDropdown } from 'react-country-region-selector';
import Header from '../Header/Header';

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
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f0f2f5",
      padding: "2rem",
      fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
      marginTop: "80px",
    },
    form: {
      width: "100%",
      maxWidth: "600px",
      backgroundColor: "white",
      padding: "2.5rem",
      borderRadius: "16px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.02)",
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.7)",
    },
    title: {
      textAlign: "center",
      color: "#333",
      marginBottom: "2rem",
      fontSize: "1.75rem",
      fontWeight: "600",
      position: "relative",
    },
    titleAfter: {
      content: "''",
      position: "absolute",
      bottom: "-8px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "60px",
      height: "3px",
      background: "linear-gradient(90deg, #3b82f6, #6366f1)",
      borderRadius: "2px",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      color: "#555",
      fontSize: "0.925rem",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      border: "1.5px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "1rem",
      color: "#1e293b",
      backgroundColor: "#fff",
      transition: "all 0.2s ease",
    },
    errorInput: {
      borderColor: "#ef4444",
    },
    errorMessage: {
      color: "#ef4444",
      fontSize: "0.875rem",
      marginTop: "0.25rem",
    },
    fileInput: {
      width: "100%",
      padding: "0.75rem 1rem",
      border: "1.5px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "0.875rem",
      backgroundColor: "#fff",
      cursor: "pointer",
    },
    submitButton: {
      width: "100%",
      padding: "0.875rem",
      background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      position: "relative",
      overflow: "hidden",
    },
    submitButtonHover: {
      transform: "translateY(-1px)",
      boxShadow: "0 4px 12px rgba(59, 130, 246, 0.25), 0 0 0 2px rgba(59, 130, 246, 0.1)",
    },
    countryDropdown: {
      width: "100%",
      padding: "0.75rem 1rem",
      border: "1.5px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "1rem",
      color: "#1e293b",
      backgroundColor: "#fff",
      transition: "all 0.2s ease",
    },
  };

  return (
    <>
      <Header />
      <div style={{...styles.container}}>
        <form onSubmit={handleSubmit} style={{...styles.form}}>
          <h2 style={{...styles.title}}>
            College Registration
            <div style={{...styles.titleAfter}}></div>
          </h2>

          {Object.keys(formData).map((field) => (
            <div key={field} style={{...styles.formGroup}}>
              <label style={{...styles.label}}>
                {field.charAt(0).toUpperCase() +
                  field.slice(1).replace(/([A-Z])/g, " $1")}
              </label>
              {field === "country" ? (
                <CountryDropdown
                  value={formData.country}
                  onChange={(val) => setFormData(prev => ({ ...prev, country: val }))}
                  style={{...styles.countryDropdown}}
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
                <p style={{...styles.errorMessage}}>{errors[field]}</p>
              )}
            </div>
          ))}

          <div style={{...styles.formGroup}}>
            <label style={{...styles.label}}>
              Accreditation Certificate
            </label>
            <input
              type="file"
              id="accreditationCertificate"
              name="accreditationCertificate"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              style={{...styles.fileInput}}
            />
            {errors.accreditationCertificate && (
              <p style={{...styles.errorMessage}}>{errors.accreditationCertificate}</p>
            )}
          </div>

          <div style={{...styles.formGroup}}>
            <label style={{...styles.label}}>
              Legal Documents
            </label>
            <input
              type="file"
              id="legalDocuments"
              name="legalDocuments"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
              style={{...styles.fileInput}}
            />
            {errors.legalDocuments && (
              <p style={{...styles.errorMessage}}>{errors.legalDocuments}</p>
            )}
          </div>

          <div style={{...styles.formGroup}}>
            <label style={{...styles.label}}>
              College Image
            </label>
            <input
              type="file"
              id="collegeImage"
              name="collegeImage"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              style={{...styles.fileInput}}
            />
            {errors.collegeImage && (
              <p style={{...styles.errorMessage}}>{errors.collegeImage}</p>
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
            style={{...styles.submitButton}}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.25), 0 0 0 2px rgba(59, 130, 246, 0.1)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            Register College
          </button>
        </form>
      </div>
    </>
  );
};

export default CollegeRegistrationForm;
