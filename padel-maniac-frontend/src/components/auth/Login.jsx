import { useState } from "react";
import './style/Registration.css';
import authService from "../../services/AuthService";
import {data, Link} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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
            newErrors.username = 'Please enter username';
        }

        if (!formData.password) {
            newErrors.password = 'Please enter password';
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
        setSuccessMessage('');

        try {
            const resp = await authService.login(formData.username, formData.password);
            localStorage.setItem("token", resp.data.data.token);
            var decode = jwtDecode(resp.data.data.token)
            localStorage.setItem("role",decode.roles[0]);
            localStorage.setItem("userId", decode.userId);
            localStorage.setItem("username", decode.sub);
            setTimeout(() => {
                setIsSubmitting(false);
                navigate("/")
            }, 1500);

        } catch (error) {

            if (error.response) {
                if (error.response.status === 401) {
                    setErrors({
                        general: '❌ ' + error.response.data
                    });
                } else if (error.response.status === 404) {
                    setErrors({
                        general: '👤 ' + error.response.data
                    });
                } else {
                    setErrors({
                        general: '❌ Server error'
                    });
                }
            } else {

            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <div className="form-wrapper">
                <div className="form-header">
                    <h2>🔐 Welcome back</h2>
                    <p>Find new match</p>
                </div>

                <form onSubmit={handleSubmit} className="forms">
                    {errors.general && (
                        <div className="error-message general-error">
                            {errors.general}
                        </div>
                    )}

                    {successMessage && (
                        <div className="success-message">
                            {successMessage}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">
                            <span className="label-icon">👤</span>
                            Korisničko ime *
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? 'error' : ''}
                            placeholder="Username"
                        />
                        {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            <span className="label-icon">🔒</span>
                            Lozinka *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="Password"
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Save password</span>
                        </label>
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
                                    Logging...
                                </>
                            ) : (
                                '🔑 Login'
                            )}
                        </button>

                        <div className="form-links">
                            <p>
                                Do you have account? <Link to="/Registration">Register</Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;