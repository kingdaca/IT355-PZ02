import React, {useEffect, useState} from "react";
import "./style/CreatMatch.css"
import CitiesService from "../../services/CitiesService";
import MatchService from "../../services/MatchService";
import {useNavigate} from "react-router-dom";
import matchers from "@testing-library/jest-dom/matchers";

const CreateMatch = () => {
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        CitiesService.getAllCities()
            .then(response => {
                setCities(response.data);
            })
            .catch(error => {
                console.error(error);
                setErrors(prev => ({...prev, general: 'Failed to load cities. Please try again.'}));
            });
    }, []);

    const [formData, setFormData] = useState({
        city: '',
        numberOfPlayers: '',
        date: '',
        matchAroundTime: '',
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.numberOfPlayers.trim()) {
            newErrors.numberOfPlayers = 'Number of players is required';
        }

        if (!formData.date) {
            newErrors.date = 'Date is required';
        } else {
            const selectedDate = new Date(formData.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                newErrors.date = 'Date cannot be in the past';
            }
        }

        if (!formData.city) {
            newErrors.city = 'City is required';
        }

        return newErrors;
    };

    const onCreateMatch = async (e) => {
        e?.preventDefault();

        // Validate form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        formData.matchAroundTime = formData.date.slice(-5);

        setIsSubmitting(true);
        setErrors({}); // Clear previous errors

        try {
            const response = await MatchService.createMatch(formData);
            console.log("Match created successfully:", response);

            // Show success message
            setErrors({general: 'success'});

            // Reset form on success
            setFormData({
                city: '',
                numberOfPlayers: '',
                date: '',
                notes: '',
                aroundTime: ''
            });

            setTimeout(()=>{
                navigate("/HomePage")
            })

        } catch (error) {
            console.error("Error creating match:", error);

            if (error.response) {
                // Handle backend validation errors
                if (error.response.status === 400) {
                    const errorData = error.response.data;
                    if (errorData.errors) {
                        // Map backend errors to form fields
                        const backendErrors = {};
                        errorData.errors.forEach(err => {
                            if (err.field) {
                                backendErrors[err.field] = err.message;
                            }
                        });
                        setErrors(backendErrors);
                    } else if (errorData.message) {
                        setErrors({general: errorData.message});
                    }
                } else if (error.response.status === 409) {
                    setErrors({general: 'A match with similar details already exists.'});
                } else {
                    setErrors({general: 'Failed to create match. Please try again.'});
                }
            } else if (error.request) {
                setErrors({general: 'Network error. Please check your connection.'});
            } else {
                setErrors({general: 'An unexpected error occurred.'});
            }
        } finally {
            setIsSubmitting(false);

        }
    };

    // Handle form submission on Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onCreateMatch();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h3>🎾 Create New Match</h3>
                </div>

                <div className="modal-content">
                    {/* Success Message */}
                    {errors.general === 'success' && (
                        <div className="success-message">
                            ✅ Match created successfully!
                        </div>
                    )}

                    {/* Error Message */}
                    {errors.general && errors.general !== 'success' && (
                        <div className="error-message">
                            ❌ {errors.general}
                        </div>
                    )}

                    <form onSubmit={onCreateMatch} className="match-form">
                        <div className="form-group">
                            <label>How many players are you looking for? *</label>
                            <select
                                className={`form-control ${errors.numberOfPlayers ? 'error' : ''}`}
                                name="numberOfPlayers"
                                onChange={handleChange}
                                value={formData.numberOfPlayers}
                                onKeyPress={handleKeyPress}
                            >
                                <option value="">Select number of players</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                            {errors.numberOfPlayers && (
                                <span className="error-text">{errors.numberOfPlayers}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Date & Time *</label>
                            <input
                                name="date"
                                onChange={handleChange}
                                value={formData.date}
                                type="datetime-local"
                                className={`form-control ${errors.date ? 'error' : ''}`}
                                onKeyPress={handleKeyPress}
                            />
                            {errors.date && (
                                <span className="error-text">{errors.date}</span>
                            )}
                        </div>


                        <div className="form-group">
                            <label>Location *</label>
                            <select
                                className={`form-control ${errors.city ? 'error' : ''}`}
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                            >
                                <option value="">Select city</option>
                                {cities.map(city => (
                                    <option key={city.id} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                            {errors.city && (
                                <span className="error-text">{errors.city}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Notes (Optional)</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="form-control"
                                rows="3"
                                placeholder="Any special requirements or notes..."
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        <div className="form-footer" style={{display: 'none'}}>
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn-create"
                        onClick={onCreateMatch}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Creating Match...
                            </>
                        ) : (
                            'Create Match'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateMatch;