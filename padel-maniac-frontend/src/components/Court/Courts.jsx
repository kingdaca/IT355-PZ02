import React, { useState, useEffect } from 'react';
import './Courts.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt,
    faPhone,
    faClock,
    faMoneyBillWave,
    faStar,
    faFilter,
    faSearch,
    faCheckCircle,
    faWifi,
    faParking,
    faShower,
    faTint,
    faUsers,
    faCalendarCheck,
    faCrown,
    faMap,
    faTableTennisPaddleBall
} from '@fortawesome/free-solid-svg-icons';
import CourtService from '../../services/CourtService';
import CitiesService from "../../services/CitiesService";

const Courts = () => {
    const [courts, setCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('all');
    const [cities, setCities] = useState([]);
    const [sortBy, setSortBy] = useState('name');

    // Fetch courts from database
    useEffect(() => {
        fetchCourts();
    }, []);

    const fetchCourts = async () => {
        try {
            setLoading(true);
            const response = await CourtService.getCourts();
            setCourts(response.data.data);

            // Extract unique cities
            const responseCity = await CitiesService.getAllCities();
            responseCity.data.data.push("all");
            setCities(responseCity.data.data);

        } catch (err) {
            console.error('Error fetching courts:', err);
            setError('Failed to load courts. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort courts
    const filteredCourts = courts
        .filter(court => {
            // Filter by city
            if (selectedCity !== 'all') {
                const courtCity = court.city || 'Unknown';
                if (courtCity !== selectedCity) return false;
            }

            // Filter by search query
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                return (
                    court.courtName?.toLowerCase().includes(query) ||
                    court.address?.toLowerCase().includes(query) ||
                    court.city?.name?.toLowerCase().includes(query) ||
                    court.phone?.includes(query)
                );
            }

            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.courtName?.localeCompare(b.courtName);
                case 'city':
                    return (a.city?.name || '').localeCompare(b.city?.name || '');
                case 'rating':
                    return (b.rating || 0) - (a.rating || 0);
                case 'price':
                    return (a.pricePerHour || 0) - (b.pricePerHour || 0);
                default:
                    return 0;
            }
        });

    // Calculate average rating (if not provided)
    const calculateRating = (court) => {
        return court.rating || 4.0 + Math.random() * 1.5; // Random if not in DB
    };

    // Get facilities based on court data
    const getFacilities = (court) => {
        const baseFacilities = ['WiFi', 'Parking', 'Shower'];
        const randomFacilities = ['Bar', 'Pro Shop', 'Lighting', 'Air Conditioning', 'Changing Rooms'];

        // Return 3-5 random facilities
        return [...baseFacilities, ...randomFacilities]
            .sort(() => Math.random() - 0.5)
            .slice(0, 3 + Math.floor(Math.random() * 3));
    };

    // Loading state
    if (loading) {
        return (
            <div className="courts-loading">
                <div className="spinner"></div>
                <p>Loading courts...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="courts-error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={fetchCourts}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="courts-container">
            {/* Hero Section */}
            <div className="courts-hero">
                <div className="hero-content">
                    <h1>🎾 Our Padel Court Partners</h1>
                    <p>Discover the best padel courts in your city. All our partner courts offer excellent facilities and competitive rates.</p>
                </div>
                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-number">{courts.length}</span>
                        <span className="stat-label-court">Partner Courts</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{cities.length - 1}</span>
                        <span className="stat-label-court">Cities</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">24/7</span>
                        <span className="stat-label-court">Booking Available</span>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="courts-filters">
                <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                        type="text"
                        placeholder="Search courts by name, address, or city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <div className="filter-select">
                        <label htmlFor="city-filter">
                            <FontAwesomeIcon icon={faMapMarkerAlt} /> City
                        </label>
                        <select
                            id="city-filter"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                        >
                            <option value="all">All Cities</option>
                            {cities.filter(city => city !== 'all').map(city => (
                                <option key={city} value={city.name}>{city.name}</option>
                            ))}
                        </select>
                    </div>

                </div>
            </div>

            {/* Courts Grid */}
            <div className="courts-grid">
                {filteredCourts.length > 0 ? (
                    filteredCourts.map(court => {
                        const rating = calculateRating(court);
                        const facilities = getFacilities(court);

                        return (
                            <div key={court.id} className="court-card">
                                {/* Premium Badge */}
                                {court.isPremium && (
                                    <div className="premium-badge">
                                        <FontAwesomeIcon icon={faCrown} /> Premium Partner
                                    </div>
                                )}

                                {/* Court Image */}
                                <div className="court-image">
                                    <div className="city-badge">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} />
                                        {court.city || 'Unknown'}
                                    </div>
                                </div>

                                {/* Court Content */}
                                <div className="court-content">
                                    {/* Header */}
                                    <div className="court-header">
                                        <h3>{court.courtName || 'Padel Court'}</h3>
                                        <div className="court-rating">
                                            <span className="rating-stars">
                                                {'★'.repeat(Math.floor(rating))}
                                                {'☆'.repeat(5 - Math.floor(rating))}
                                            </span>
                                            <span className="rating-value">{rating.toFixed(1)}</span>
                                            <span className="rating-count">({Math.floor(Math.random() * 100) + 20} reviews)</span>
                                        </div>
                                    </div>

                                    {/* Address & Contact */}
                                    <div className="court-info">
                                        <div className="info-item">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                            <span>{court.city}, {court.address || 'Address not specified'}</span>
                                        </div>
                                        {court.phone && (
                                            <div className="info-item">
                                                <FontAwesomeIcon icon={faPhone} />
                                                <span>{court.phone}</span>
                                            </div>
                                        )}
                                        <div className="info-item">
                                            <FontAwesomeIcon icon={faClock} />
                                            <span>Open: 07:00 - 23:00</span>
                                        </div>
                                        <div className="info-item">
                                            <FontAwesomeIcon icon={faMoneyBillWave} />
                                            <span className="price">From {court.pricePerHour || 2000} RSD/hour</span>
                                        </div>
                                    </div>

                                    {/* Facilities */}
                                    <div className="court-facilities">
                                        <h4>Facilities:</h4>
                                        <div className="facilities-list">
                                            {facilities.map((facility, index) => (
                                                <span key={index} className="facility-tag">
                                                    <FontAwesomeIcon icon={
                                                        facility === 'WiFi' ? faWifi :
                                                            facility === 'Parking' ? faParking :
                                                                facility === 'Shower' ? faShower :
                                                                    faCheckCircle
                                                    } />
                                                    {facility}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="court-actions">
                                        <button className="btn-book">
                                            <FontAwesomeIcon icon={faCalendarCheck} />
                                            Book Court
                                        </button>
                                        <button className="btn-details">
                                            <FontAwesomeIcon icon={faMap} />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-courts">
                        <FontAwesomeIcon icon={faTableTennisPaddleBall} size="3x" />
                        <h3>No courts found</h3>
                        <p>Try changing your search criteria or check back later.</p>
                        <button
                            className="btn-clear-filters"
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCity('all');
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courts;