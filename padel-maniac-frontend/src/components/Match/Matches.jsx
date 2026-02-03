import React, { useState, useEffect } from 'react';
import './style/Matches.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {formatDate, formatTime, formatTimeSimple} from '../../Utils/dataFormatter'

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
import {Link, useNavigate} from "react-router-dom";

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
            }).finally(() =>{

        })
    }, []);

    const navigate = useNavigate();

    const [filters, setFilters] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [matches, setMatches] = useState([]);
    const [userId, setUserId] = useState(Number(localStorage.getItem("userId")))



    const [filteredMatches, setFilteredMatches] = useState(matches);

    // Filter matches based on selected filter and search query
    useEffect(() => {
        let result = [...matches];

        // Apply status filter
        if (filters === 'nearby') {
            // Prilagodi ovu logiku - možda treba da filtriraš po gradu ili regionu
            // Na primer, ako imate cityId u user-u ili lokaciji
            result = result.filter(match => {
                // Ovde implementiraj svoju logiku za "nearby"
                // Na primer: match.location.cityId === userCityId
                return true; // Za sada prikaži sve
            });
        } else if (filters === 'today') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            result = result.filter(match => {
                const matchDate = new Date(match.matchDay);
                matchDate.setHours(0, 0, 0, 0);
                return matchDate.getTime() === today.getTime();
            });
        } else if (filters === 'recommended') {
            // Ovde implementiraj logiku za preporučene mečeve
            // Možda po nivou igrača, lokaciji, ili drugim faktorima
            result = result.filter(match => {
                // Na primer: match.level === userLevel
                return true; // Za sada prikaži sve
            });
        }

        // Apply search filter
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(match =>
                match.location?.toLowerCase().includes(query) ||
                match.matchOrganizer?.firstName?.toLowerCase().includes(query) ||
                match.matchOrganizer?.lastName?.toLowerCase().includes(query) ||
                match.notes?.toLowerCase().includes(query)
            );
        }

        setFilteredMatches(result);
    }, [filters, searchQuery, matches]);


    const isUserInMatch = (matchId) => {
       var m = matches.find(match => match.id === matchId);
        return m.players.some(p => p.id === userId);
    }

    const handleFilterClick = (filter) => {
        setFilters(filter);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleJoinMatch = async (matchId, organizerName) => {
        try {
            const response = await MatchService.joinToMatch(matchId);

            setMatches(prev =>
                prev.map(m =>
                    m.id === response.data.id ? response.data : m
                )
            );
        }catch(error){
            console.log(error)
            setErrors(error);
        }

    };

    const handleCreateMatch = () => {
        navigate("/CreateMatch")
    };

    const getStatusClass = (status) => {
        //     OPEN, CANCELED, FULL, ONGOING , ENDED
        switch (status) {
            case 'OPEN': return 'open';
            case 'FULL': return 'full';
            case 'ONGOING': return 'ongoing';
            case 'CANCELED': return 'canceled';
            case 'ENDED': return 'ended';
            default: return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'OPEN': return 'Open';
            case 'FULL': return 'Full';
            case 'ONGOING': return 'Ongoing';
            case 'CANCELED': return 'Canceled';
            case 'ENDED': return 'Ended';
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
                {(
                    filteredMatches.map(match => (
                        <div className="match-card" key={match.id}>
                            <div className="match-header">
                                <div className="match-type">
                                    <FontAwesomeIcon icon={faUsers} />
                                        <span>Match</span>
                                </div>
                                <div className={`match-status ${getStatusClass(match.matchStatus)}`}>
                                    {getStatusText(match.matchStatus)}
                                </div>
                            </div>

                            <div className="match-content">
                                <div className="match-details">
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faCalendarDay}/>
                                        <span>Date:</span> {formatDate(match.matchDay)}
                                    </div>
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faCalendarDay}/>
                                        <span>Around time:</span> {formatTimeSimple(match.matchAroundTime)}
                                    </div>
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faClock}/>
                                        <span>Duration:</span>
                                        {match.matchDuration} h
                                    </div>
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faMapMarkerAlt}/>
                                        <span>Location:</span> {match.location}
                                    </div>
                                    <div className="detail-item">
                                        <FontAwesomeIcon icon={faUserFriends}/>
                                        <span>Free space:</span> {match.freePosition}
                                    </div>
                                </div>

                                <div className="players-section">
                                    <div className="players-header">
                                        <FontAwesomeIcon icon={faUserFriends}/>
                                        <span>
            {match.freePosition > 0
                ? `Players Needed: ${match.freePosition} slot${match.freePosition > 1 ? 's' : ''} available`
                : match.matchStatus === 'ONGOING'
                    ? 'Match in Progress'
                    : 'All Slots Filled'
            }
        </span>
                                    </div>

                                    <div className="player-slots-container">
                                        {/* Prikaz trenutnih igrača */}
                                        <div className="current-players">
                                            <div className="players-label">Joined Players
                                                ({match.players.length}/{match.players.length + match.freePosition}):
                                            </div>
                                            <div className="players-list">
                                                {match.players.map((player, index) => (
                                                    <div
                                                        key={player.id || index}
                                                        className={`player-badge ${player.id === match.matchOrganizer?.id ? 'organizer' : ''}`}
                                                        title={player.id === match.matchOrganizer?.id ? 'Organizer' : 'Player'}
                                                    >
                                                        <div className="player-avatar">
                                                            {player.firstName?.charAt(0) || 'P'}
                                                        </div>
                                                        <div className="player-info">
                                                            <div className="player-name">
                                                                {player.firstName} {player.lastName}
                                                                {player.id === match.matchOrganizer?.id && (
                                                                    <span className="organizer-tag">👑</span>
                                                                )}
                                                            </div>
                                                            <div className="player-level">
                                                                {player.level && (
                                                                    <span
                                                                        className={`level-badge level-${player.level.toLowerCase()}`}>
                                        {player.level}
                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Prikaz praznih slotova */}
                                        {match.freePosition > 0 && (
                                            <div className="available-slots">
                                                <div className="slots-label">Available Slots:</div>
                                                <div className="slots-grid">
                                                    {[...Array(match.freePosition)].map((_, index) => (
                                                        <div key={`empty-${index}`} className="empty-slot">
                                                            <div className="slot-icon">+</div>
                                                            <div
                                                                className="slot-label">Slot {match.players.length + index + 1}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Progress bar za popunjenost */}
                                        <div className="slots-progress">
                                            <div className="progress-bar">
                                                <div
                                                    className="progress-fill"
                                                    style={{
                                                        width: `${(match.players.length / (match.players.length + match.freePosition)) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="progress-text">
                                                {match.players.length} of {match.players.length + match.freePosition} players
                                                joined
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                    {match.matchStatus === 'OPEN' && match.freePosition > 0 && match.matchOrganizer.id != userId && !isUserInMatch(match.id)  ? (
                                        <>
                                            <button
                                                className="action-btn join-btn"
                                                onClick={() => handleJoinMatch(match.id)}
                                            >

                                                <FontAwesomeIcon icon={faSignInAlt}/> Join Match
                                            </button>
                                            <Link
                                                to={`/match/${match.id}`}
                                                className="action-btn details-btn"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                                View Details
                                            </Link>
                                        </>
                                    ) : match.status === 'ongoing' ? (
                                        <button
                                            className="action-btn details-btn"
                                            style={{flex: 1}}
                                            // onClick={() => handleViewDetails(match.id, match.organizer.name)}
                                        >
                                            <FontAwesomeIcon icon={faBroadcastTower}/> Live Score
                                        </button>
                                    ) : (
                                        <Link
                                            to={`/match/${match.id}`}
                                            className="action-btn details-btn"
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                            View Details
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Matches;