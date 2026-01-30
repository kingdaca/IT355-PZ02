import React, { useState, useEffect } from 'react';
import './style/Matches.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTableTennisPaddleBall,
    faList,
    faMapMarkerAlt,
    faUserFriends,
    faCalendarAlt,
    faStar,
    faSearch,
    faPlus,
    faUsers,
    faUser,
    faCalendarDay,
    faSignal,
    faClock,
    faSignInAlt,
    faInfoCircle,
    faEye,
    faBroadcastTower
} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from "react-router-dom";

import MatchService from "../../services/MatchService";

const Matches = () => {
    const [errors, setErrors] = useState({});
    useEffect(() => {
        MatchService.getMatches()
            .then(response => {
                setMatches(response.data);
            })
            .catch(error => {
                console.error(error);
                setMatches(prev => ({...prev, general: 'Failed to load cities. Please try again.'}));
            });
    }, []);

    const navigate = useNavigate();
    const [filters, setFilters] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [matches, setMatches] = useState([]);

    const [filteredMatches, setFilteredMatches] = useState(matches);

    // Filter matches based on selected filter and search query
    useEffect(() => {
        let result = [...matches];

        // Apply status filter
        if (filters === 'nearby') {
            // In a real app, this would filter by location
            result = result.filter(match => match.location.includes('City') || match.location.includes('Central'));
        } else if (filters === 'need-players') {
            result = result.filter(match => match.playersNeeded > 0);
        } else if (filters === 'today') {
            result = result.filter(match => match.date.includes('Today'));
        } else if (filters === 'recommended') {
            result = result.filter(match => match.organizer.rating >= 4.5);
        }

        // Apply search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(match =>
                match.location.toLowerCase().includes(query) ||
                match.level.toLowerCase().includes(query) ||
                match.organizer.name.toLowerCase().includes(query) ||
                match.type.toLowerCase().includes(query)
            );
        }

        setFilteredMatches(result);
    }, [filters, searchQuery, matches]);

    const handleFilterClick = (filter) => {
        setFilters(filter);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleJoinMatch = (matchId, organizerName) => {
        alert(`Joining match organized by ${organizerName}...`);
        // In a real app, this would make an API call
    };

    const handleViewDetails = (matchId, organizerName) => {
        alert(`Showing details for match organized by ${organizerName}`);
        // In a real app, this would navigate to match details page
    };

    const handleCreateMatch = () => {
        navigate("/CreateMatch")
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'open': return 'open';
            case 'full': return 'full';
            case 'ongoing': return 'ongoing';
            default: return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'open': return 'OPEN';
            case 'full': return 'FULL';
            case 'ongoing': return 'ONGOING';
            default: return '';
        }
    };

    return (
        <div className="matches-container">
            {/* Header */}
            <div className="header">
                <h1>
                    <FontAwesomeIcon icon={faTableTennisPaddleBall} />
                    Padel <span className="highlight">Matches</span>
                </h1>
                <p>Find and join padel matches in your area. Connect with players of all skill levels.</p>
            </div>

            {/* Filters Section */}
            <div className="filters-section">
                <div className="filter-group">
                    <button
                        className={`filter-btn ${filters === 'all' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('all')}
                    >
                        <FontAwesomeIcon icon={faList} /> All Matches
                    </button>
                    <button
                        className={`filter-btn ${filters === 'nearby' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('nearby')}
                    >
                        <FontAwesomeIcon icon={faMapMarkerAlt} /> Nearby
                    </button>
                    <button
                        className={`filter-btn ${filters === 'need-players' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('need-players')}
                    >
                        <FontAwesomeIcon icon={faUserFriends} /> Need Players
                    </button>
                    <button
                        className={`filter-btn ${filters === 'today' ? 'active' : ''}`}
                        onClick={() => handleFilterClick('today')}
                    >
                        <FontAwesomeIcon icon={faCalendarAlt} /> Today
                    </button>
                </div>

                <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                        type="text"
                        placeholder="Search matches, locations, or players..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

                <button className="create-match-btn" onClick={handleCreateMatch}>
                    <FontAwesomeIcon icon={faPlus} /> Create Match
                </button>
            </div>

            {/* Matches List */}
            <div className="matches-list">
                {filteredMatches.length > 0 ? (
                    filteredMatches.map(match => (
                        <div className="match-card" key={match.id}>
                            <div className="match-header">
                                <div className="match-type">
                                    <FontAwesomeIcon icon={faUsers} />
                                        Match
                                </div>
                                <div className={`match-status ${getStatusClass(match.status)}`}>
                                    {getStatusText(match.status)}
                                </div>
                            </div>

                            <div className="match-content">
                                <div className="match-details">
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faCalendarDay}/>
                                        <span>Date:</span> {match.date}
                                    </div>
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faMapMarkerAlt}/>
                                        <span>Location:</span> {match.location}
                                    </div>
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faSignal}/>
                                        <span>Level:</span> {match.level}
                                    </div>
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faUserFriends}/>
                                        <span>Free space:</span> {match.playersNeeded - match?.players?.length}
                                    </div>
                                    {/*<div className="detail-item">*/}
                                    {/*    <FontAwesomeIcon icon={faClock} />*/}
                                    {/*    <span>Duration:</span> {match.duration}*/}
                                    {/*</div>*/}
                                </div>

                                {/*<div className="players-needed">*/}
                                {/*    <p>*/}
                                {/*        <FontAwesomeIcon icon={faUserFriends}/>*/}
                                {/*        {match.playersNeeded > 0 ? 'Players Needed:' : match.status === 'ongoing' ? 'Match in Progress:' : 'All Slots Filled:'}*/}
                                {/*    </p>*/}
                                {/*    <div className="player-slots">*/}
                                {/*        {match.slots.map(slot => (*/}
                                {/*            <div*/}
                                {/*                key={slot.id}*/}
                                {/*                className={`player-slot ${slot.status}`}*/}
                                {/*            >*/}
                                {/*                {slot.label}*/}
                                {/*            </div>*/}
                                {/*        ))}*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                {/*<div className="match-organizer">*/}
                                {/*    <div className="organizer-avatar">*/}
                                {/*        {match.organizer.avatar}*/}
                                {/*    </div>*/}
                                {/*    <div className="organizer-info">*/}
                                {/*        <h4>{match.organizer.name}</h4>*/}
                                {/*        <p>*/}
                                {/*            Organizer •*/}
                                {/*            {match.organizer.rating*/}
                                {/*                ? ` ${match.organizer.rating}⭐ (${match.organizer.reviews} reviews)`*/}
                                {/*                : ' New Organizer'*/}
                                {/*            }*/}
                                {/*        </p>*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                <div className="match-actions">
                                    {match.status === 'open' && match.playersNeeded > 0 ? (
                                        <>
                                            <button
                                                className="action-btn join-btn"
                                                onClick={() => handleJoinMatch(match.id, match.organizer.name)}
                                            >
                                                <FontAwesomeIcon icon={faSignInAlt} /> Join Match
                                            </button>
                                            <button
                                                className="action-btn details-btn"
                                                onClick={() => handleViewDetails(match.id, match.organizer.name)}
                                            >
                                                <FontAwesomeIcon icon={faInfoCircle} /> Details
                                            </button>
                                        </>
                                    ) : match.status === 'ongoing' ? (
                                        <button
                                            className="action-btn details-btn"
                                            style={{flex: 1}}
                                            onClick={() => handleViewDetails(match.id, match.organizer.name)}
                                        >
                                            <FontAwesomeIcon icon={faBroadcastTower} /> Live Score
                                        </button>
                                    ) : (
                                        <button
                                            className="action-btn details-btn"
                                            style={{flex: 1}}
                                            onClick={() => handleViewDetails(match.id, match.organizer.name)}
                                        >
                                            <FontAwesomeIcon icon={faEye} /> View Details
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-matches">
                        <h3><FontAwesomeIcon icon={faSearch} /> No Matches Found</h3>
                        <p>Try adjusting your filters or create the first match in your area!</p>
                        <button className="create-match-btn" onClick={handleCreateMatch}>
                            <FontAwesomeIcon icon={faPlus} /> Create First Match
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Matches;