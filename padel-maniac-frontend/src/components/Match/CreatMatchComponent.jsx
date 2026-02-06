import React, {useEffect, useState} from "react";
import "./style/CreatMatch.css"
import CitiesService from "../../services/CitiesService";
import MatchService from "../../services/MatchService";
import {useNavigate} from "react-router-dom";

const CreateMatch = () => {
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        CitiesService.getAllCities()
            .then(response => {
                setCities(response.data.data);
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
        matchDuration: '',
        needReservation: '',
        matchAroundTime: '',
        notes: '',
    });

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

        if (formData.needReservation === 'true' && !formData.notes.trim()) {
            newErrors.notes = 'Notes are required when you have a reservation';
        }

        if (!formData.needReservation) {
            newErrors.needReservation = 'Please select an option for reservation';
        }

        return newErrors;
    };

    const onCreateMatch = async (e) => {
        e?.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        formData.matchAroundTime = formData.date.slice(-5);

        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await MatchService.createMatch(formData);
            console.log("Match created successfully:", response);

            setErrors({general: 'success'});

            setFormData({
                city: '',
                numberOfPlayers: '',
                needReservation: '',
                date: '',
                notes: '',
                matchDuration: '',
            });

            setTimeout(() => {
                navigate("/")
            }, 2000);

        } catch (error) {
            console.error("Error creating match:", error);

            if (error.response) {
                if (error.response.status === 400) {
                    const errorData = error.response.data.data;
                    if (errorData.errors) {
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
                    {errors.general === 'success' && (
                        <div className="success-message">
                            ✅ Match created successfully!
                        </div>
                    )}

                    {errors.general && errors.general !== 'success' && (
                        <div className="error-message">
                            ❌ {errors.general}
                        </div>
                    )}

                    <form onSubmit={onCreateMatch} className="match-form">
                        <div className="form-group">
                            <label>Do you have a reservation? *</label>
                            <select
                                className={`form-control ${errors.needReservation ? 'error' : ''}`}
                                name="needReservation"
                                value={formData.needReservation}
                                onChange={handleChange}
                            >
                                <option value="">Select an option</option>
                                <option value="true">I have a reservation</option>
                                <option value="false">I want the court to send an offer</option>
                            </select>

                            {errors.needReservation && (
                                <span className="error-text">{errors.needReservation}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Number of Players *</label>
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
                                <option value="4">4</option>
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
                            <label htmlFor="matchDuration">Match Duration</label>
                            <select
                                id="matchDuration"
                                name="matchDuration"
                                onChange={handleChange}
                                value={formData.matchDuration}
                                className={`form-control ${errors.matchDuration ? 'error' : ''}`}
                            >
                                <option value="">Select duration...</option>
                                {Array.from({length: 7}, (_, i) => {
                                    const hours = 1 + (i * 0.5);
                                    const displayValue = hours === Math.floor(hours) ?
                                        `${hours} hour${hours === 1 ? '' : 's'}` :
                                        `${hours} hours`;
                                    return (
                                        <option key={hours} value={hours}>
                                            {displayValue}
                                        </option>
                                    );
                                })}
                            </select>
                            {errors.matchDuration && (
                                <span className="error-text">{errors.matchDuration}</span>
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
                            <label>
                                Notes
                                {formData.needReservation === 'true' ? ' *' : ' (Optional)'}
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className={`form-control ${errors.notes ? 'error' : ''}`}
                                rows="3"
                                placeholder={
                                    formData.needReservation === 'true'
                                        ? "Please provide reservation details (court number, time, etc.)..."
                                        : "Any special requirements or notes..."
                                }
                                onKeyPress={handleKeyPress}
                            />
                            {errors.notes && (
                                <span className="error-text">{errors.notes}</span>
                            )}
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