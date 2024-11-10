import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header/Header"; // Import Header
import Swal from "sweetalert2";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) error = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Email is invalid";
        break;
      case "password":
        if (!value) error = "Password is required";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors({
      ...errors,
      [name]: validateField(name, value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/auth/login-for-all`,
          formData
        );

        const { status, token, role, collegeId, studentId } = response.data;

        if (status === 1) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);
          localStorage.setItem("studentId", studentId)
          if (role === "CollegeAdmin" && collegeId) {
            localStorage.setItem("collegeId", collegeId);
          }
          navigate(
            role === "Admin"
              ? "/adminDashboard"
              : role === "Student"
              ? "/studentDashboard"
              : "/collegeadminDashboard"
          );
        } else {
          setErrors({ form: "Invalid credentials" });
        }
      } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        setErrors({ form: error.response?.data?.msg || "An error occurred during login" });
      }
    }
  };


  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
  };

  const formStyle = {
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  };

  const errorMessageStyle = {
    color: "red",
    fontSize: "14px",
    marginTop: "5px",
  };

  const linkStyle = {
    display: "block",
    marginTop: "10px",
    color: "#007bff",
    textDecoration: "none",
  };

  return (
    <div>
      <Header />
      <div style={containerStyle}>
        <form style={formStyle} onSubmit={handleSubmit}>
          <h2>Login</h2>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle}
              required
            />
            {errors.email && <p style={errorMessageStyle}>{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              style={inputStyle}
              required
            />
            {errors.password && (
              <p style={errorMessageStyle}>{errors.password}</p>
            )}
          </div>

          {errors.form && <p style={errorMessageStyle}>{errors.form}</p>}

          <button type="submit" style={buttonStyle}>
            Login
          </button>
          <Link to="/forgot-password" style={linkStyle}>
            Forgot Password?
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
