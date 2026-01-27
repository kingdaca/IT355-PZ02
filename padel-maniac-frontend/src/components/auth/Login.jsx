import { useState } from "react";
import './style/Login.css';
import authService from "../../services/AuthService";
import {Link} from "react-router-dom";

const Login = () => {
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
            newErrors.username = 'Korisničko ime je obavezno';
        }

        if (!formData.password) {
            newErrors.password = 'Lozinka je obavezna';
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

            setTimeout(() => {
                setSuccessMessage('🎉 Uspešno ste prijavljeni!');
                setIsSubmitting(false);
            }, 1500);

        } catch (error) {
            console.error('Greška pri prijavi:', error);

            if (error.response) {
                if (error.response.status === 401) {
                    setErrors({
                        general: '❌ Pogrešno korisničko ime ili lozinka.'
                    });
                } else if (error.response.status === 404) {
                    setErrors({
                        general: '👤 Korisnik nije pronađen.'
                    });
                } else {
                    setErrors({
                        general: '❌ Došlo je do greške pri prijavi.'
                    });
                }
            } else {
                setErrors({
                    general: '🌐 Problem sa mrežom. Pokušajte ponovo.'
                });
            }
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <div className="form-wrapper">
                <div className="form-header">
                    <h2>🔐 Dobrodošli Nazad</h2>
                    <p>Prijavite se i pronađite novi meč</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
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
                            placeholder="Unesite korisničko ime"
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
                            placeholder="Unesite lozinku"
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Zapamti me</span>
                        </label>
                        <a href="/forgot-password" className="forgot-password">
                            Zaboravili ste lozinku?
                        </a>
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
                                    Prijavljujem...
                                </>
                            ) : (
                                '🔑 Prijavi se'
                            )}
                        </button>

                        <div className="divider">
                            <span>ili</span>
                        </div>

                        <div className="form-links">
                            <p>
                                Nemate nalog? <Link to="/Registration">Registrujte se</Link>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;