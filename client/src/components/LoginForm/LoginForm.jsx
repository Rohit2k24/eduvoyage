import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';
import Header from '../Header/Header'; // Import Header

function LoginForm() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
                const response = await axios.post('http://localhost:5000/api/auth/login', formData);
                const { status, token, role } = response.data;

                if (status === 1) {
                    localStorage.setItem('token', token);

                    if (role === 'Admin') {
                        navigate('/adminDashboard');
                    } else if (role === 'Student') {
                        navigate('/studentDashboard');
                    } else {
                        navigate('/studentDashboard');
                    }
                }
            } catch (error) {
                console.error('Login error:', error.response?.data || error.message);
                setErrors({ form: 'Invalid email or password' });
                if (error.response && error.response.data && error.response.data.msg) {
                    alert(error.response.data.msg);
                } else {
                    alert('An error occurred. Please try again.');
                }
            }
        }
    };

    return (
        <div>
            <Header />
            <div className="login-form-container">
                <form className="login-form" onSubmit={handleSubmit}>
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
                            required
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
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
                            required
                        />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>

                    {errors.form && <p className="error-message">{errors.form}</p>}

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
