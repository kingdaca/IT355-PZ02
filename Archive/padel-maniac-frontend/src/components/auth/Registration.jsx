import React, { useState } from 'react';
import axios from 'axios';
import './style/Registration.css';
import authService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";


const RegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        firstname: '',
        lastName: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email format is invalid';
        }

        if (!formData.firstname.trim()) {
            newErrors.firstname = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (formData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Phone number format is invalid';
        }


        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setSuccessMessage('');
        setErrors({});

        try {
            const response = await authService.registration(formData);

            if (response.status === 200 || response.status === 201) {
                navigate("/Login");
            }
        } catch (error) {

            if (error.response?.status === 409) {

                setErrors({
                    general: `⚠️`+ error.response.data
                });
            } else {
                setErrors({

                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <div className="form-wrapper">
                <div className="form-header">
                    <h2>👤 Crate new account</h2>
                    <p>Join in our community</p>
                </div>

                <form onSubmit={handleSubmit} className="forms">
                    {errors.general && (
                        <div className="error-message general-error">
                            {errors.general}
                        </div>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="username">
                                <span className="label-icon">👤</span>
                                Username *
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={errors.username ? 'error' : ''}
                                placeholder="Enter your username"
                            />
                            {errors.username && <span className="error-text">{errors.username}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">
                                <span className="label-icon">✉️</span>
                                Email *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                                placeholder="name@example.com"
                            />
                            {errors.email && <span className="error-text">{errors.email}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <span className="label-icon">🔒</span>
                            Password *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="At least 6 characters"
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstname">
                                <span className="label-icon">👨</span>
                                First Name *
                            </label>
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className={errors.firstname ? 'error' : ''}
                                placeholder="Your first name"
                            />
                            {errors.firstname && <span className="error-text">{errors.firstname}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">
                                <span className="label-icon">👨‍👩‍👧</span>
                                Last Name *
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={errors.lastName ? 'error' : ''}
                                placeholder="Your last name"
                            />
                            {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">
                            <span className="label-icon">📱</span>
                            Phone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={errors.phone ? 'error' : ''}
                            placeholder="+387 61 123 456 (optional)"
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="form-footer">
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Registering...
                                </>
                            ) : (
                                '🎯 Register'
                            )}
                        </button>

                        <div className="form-links">
                            <p>Already have an account? <a href="/login">Log in</a></p>
                        </div>

                        <p className="required-note">
                            * Fields marked with an asterisk are required
                        </p>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;