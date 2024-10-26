import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

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
  
    if (file && !["image/jpeg", "image/png"].includes(file.type)) {
      setErrors({
        ...errors,
        [name]: "Only JPG and PNG files are allowed",
      });
    } else {
      setDocuments({ ...documents, [name]: file });
      setErrors({ ...errors, [name]: undefined }); // Clear the error if valid
    }
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email format regex
    const phoneRegex = /^(?!0)\d{10}$/; // Phone number regex: 10 digits, cannot start with 0

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
      case "phoneNumber":
        if (!value.trim()) {
          newErrors.phoneNumber = "Phone number is required";
        } else if (!phoneRegex.test(value)) {
          newErrors.phoneNumber =
            "Phone number must be 10 digits and cannot start with 0";
        } else {
          delete newErrors.phoneNumber;
        }
        break;
      case "accreditationCertificate":
        if (!documents.accreditationCertificate) {
          newErrors.accreditationCertificate =
            "Accreditation Certificate is required";
        } else {
          delete newErrors.accreditationCertificate;
        }
        break;
      case "legalDocuments":
        if (!documents.legalDocuments) {
          newErrors.legalDocuments = "Legal Documents are required";
        } else {
          delete newErrors.legalDocuments;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
      }
    });

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
          "http://localhost:5000/api/auth/register-college",
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log(response);

        if (
          response.status === 201 ||
          response.data.msg ===
            "College registered successfully, pending approval"
        ) {
          Swal.fire({
            title: "Registered Successfully",
            text: "Your college registration is pending approval.",
            icon: "success",
          });
          navigate("/login");
        } else {
          throw new Error("Unexpected response from server");
        }
      } catch (error) {
        console.error("Registration error:", error);
        Swal.fire({
          title: "Registration Failed",
          text:
            error.response?.data?.msg ||
            "An error occurred during registration",
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
            <input
              type={
                field === "confirmPassword"
                  ? "password"
                  : field.includes("password")
                  ? "password"
                  : "text"
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
            accept=".jpg, .jpeg, .png" 
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
            accept=".jpg, .jpeg, .png" 
            onChange={handleFileChange}
            style={styles.fileInput}
          />
          {errors.legalDocuments && (
            <p style={styles.errorMessage}>{errors.legalDocuments}</p>
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
