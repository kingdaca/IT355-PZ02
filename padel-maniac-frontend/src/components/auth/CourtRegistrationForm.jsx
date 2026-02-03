import React, { useState, useEffect } from 'react';
import './style/Registration.css';
import authService from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import CitiesService from "../../services/CitiesService";

const CourtRegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({

        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        phone: '',

        courtName: '',
        address: '',
        cityId: '',
        courtPhone: ''
    });

    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(true);

    // Dohvati gradove prilikom mount-a
    useEffect(() => {
        const fetchCities = async () => {
            try {
                setIsLoadingCities(true);
                // Koristite response.data umesto response.json()
                const response = await CitiesService.getAllCities();
                setCities(response.data); // Ovo će vratiti array objekata {id, name}
            } catch (error) {
                console.error('Error fetching cities:', error);
                setErrors({
                    general: 'Failed to load cities. Please refresh the page.'
                });
            } finally {
                setIsLoadingCities(false);
            }
        };

        fetchCities();
    }, []);

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

        // Common validation for all users
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

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        // Court-specific validation
        if (!formData.courtName.trim()) {
            newErrors.courtName = 'Court name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.cityId) {
            newErrors.cityId = 'City is required';
        }

        if (!formData.courtPhone) {
            newErrors.courtPhone = 'Court phone is required';
        } else if (!/^[\+]?[0-9\s\-\(\)]+$/.test(formData.courtPhone)) {
            newErrors.courtPhone = 'Phone number format is invalid';
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
        setErrors({});

        try {

            const registrationData = {
                ...formData
            };

            const response = await authService.registrationCourtOwner(registrationData);

            if (response.status === 200 || response.status === 201) {
                navigate("/");
            }
        } catch (error) {
            if (error.response?.status === 409) {
                setErrors({
                    general: `⚠️ ${error.response.data}`
                });
            } else {
                setErrors({
                    general: 'Registration failed. Please try again.'
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
                    <h2>🎾 Register as Tennis Court</h2>
                    <p>Join our platform as a tennis court provider</p>
                </div>

                <form onSubmit={handleSubmit} className="forms">
                    {errors.general && (
                        <div className="error-message general-error">
                            {errors.general}
                        </div>
                    )}

                    <div className="section-title">
                        <h3>👤 Personal Information</h3>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">
                                <span className="label-icon">👨</span>
                                First Name *
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={errors.firstName ? 'error' : ''}
                                placeholder="Your first name"
                            />
                            {errors.firstName && <span className="error-text">{errors.firstName}</span>}
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

                    <div className="form-group">
                        <label htmlFor="phone">
                            <span className="label-icon">📱</span>
                            Personal Phone (Optional)
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={errors.phone ? 'error' : ''}
                            placeholder="+387 61 123 456"
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="section-title">
                        <h3>🎾 Court Information</h3>
                    </div>

                    <div className="form-group">
                        <label htmlFor="courtName">
                            <span className="label-icon">🏢</span>
                            Court Name *
                        </label>
                        <input
                            type="text"
                            id="courtName"
                            name="courtName"
                            value={formData.courtName}
                            onChange={handleChange}
                            className={errors.courtName ? 'error' : ''}
                            placeholder="Enter court name"
                        />
                        {errors.courtName && <span className="error-text">{errors.courtName}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">
                            <span className="label-icon">📍</span>
                            Address *
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className={errors.address ? 'error' : ''}
                            placeholder="Full address of the court"
                        />
                        {errors.address && <span className="error-text">{errors.address}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="cityId">
                                <span className="label-icon">🏙️</span>
                                City *
                            </label>
                            {isLoadingCities ? (
                                <div className="city-loader">
                                    <div className="loader-spinner"></div>
                                    <span className="loading-text">Loading cities...</span>
                                </div>
                            ) : (
                                <>
                                    <select
                                        id="cityId"
                                        name="cityId"
                                        value={formData.cityId}
                                        onChange={handleChange}
                                        className={errors.cityId ? 'error' : 'form-control '}
                                    >
                                        <option value="">Select a city</option>
                                        {cities.map(city => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.cityId && <span className="error-text">{errors.cityId}</span>}
                                </>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="courtPhone">
                                <span className="label-icon">📞</span>
                                Court Phone *
                            </label>
                            <input
                                type="tel"
                                id="courtPhone"
                                name="courtPhone"
                                value={formData.courtPhone}
                                onChange={handleChange}
                                className={errors.courtPhone ? 'error' : ''}
                                placeholder="Court contact number"
                            />
                            {errors.courtPhone && <span className="error-text">{errors.courtPhone}</span>}
                        </div>
                    </div>

                    <div className="form-footer">
                        <button
                            type="submit"
                            className="submit-btn court-submit"
                            disabled={isSubmitting || isLoadingCities}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Registering Court...
                                </>
                            ) : (
                                '🎾 Register Court'
                            )}
                        </button>

                        <div className="form-links">
                            <p>Already have an account? <a href="/login">Log in</a></p>
                            <p>Register as player? <a href="/register">Player Registration</a></p>
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

export default CourtRegistrationForm;