import React, { useState, useEffect, useRef } from 'react';
import './style/Matches.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {formatDate, formatTimeSimple} from '../../Utils/dataFormatter'
import {
    faTableTennisPaddleBall,
    faList,
    faMapMarkerAlt,
    faUserFriends,
    faCalendarAlt,
    faSearch,
    faPlus,
    faUsers,
    faCalendarDay,
    faClock,
    faSignInAlt,
    faEye,
    faBroadcastTower
} from '@fortawesome/free-solid-svg-icons';
import {Link, useNavigate} from "react-router-dom";
import MatchService from "../../services/MatchService";

const Matches = () => {
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [filters, setFilters] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [matches, setMatches] = useState([]);
    const [dateFilter, setDateFilter] = useState(() => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    });
    const [userId, setUserId] = useState(Number(localStorage.getItem("userId") || 0));
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const datePickerRef = useRef(null);

    useEffect(() => {
        loadMatches(dateFilter);
    }, []);

    const loadMatches = async (date = null) => {
        try {
            setLoading(true);
            console.log("aaaa", date)
            const response = await MatchService.getMatches(date);
            setMatches(response.data.data || []);
        } catch(error) {
            console.error(error);
            setErrors({general: 'Failed to load matches. Please try again.'});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = [...matches];

        if (filters === 'today' && !dateFilter) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            result = result.filter(match => {
                if (!match.matchDay) return false;
                const matchDate = new Date(match.matchDay);
                matchDate.setHours(0, 0, 0, 0);
                return matchDate.getTime() === today.getTime();
            });
        }

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(match =>
                (match.location && match.location.toLowerCase().includes(query)) ||
                (match.matchOrganizer?.firstName && match.matchOrganizer.firstName.toLowerCase().includes(query)) ||
                (match.matchOrganizer?.lastName && match.matchOrganizer.lastName.toLowerCase().includes(query)) ||
                (match.notes && match.notes.toLowerCase().includes(query))
            );
        }

        setFilteredMatches(result);
    }, [filters, searchQuery, matches, dateFilter]);

    const isUserInMatch = (matchId) => {
        const m = matches.find(match => match.id === matchId);
        if (!m || !m.players) return false;
        return m.players.some(p => p.id === userId);
    };

    const handleFilterClick = async (filter) => {
        setFilters(filter);
        if (filter !== 'today') {
            setDateFilter('');
            await loadMatches();
        } else {
            const today = new Date().toISOString().split('T')[0];
            setDateFilter(today);
            await loadMatches(today);
        }
    };

    const handleDateButtonClick = () => {
        if (datePickerRef.current) {
            datePickerRef.current.showPicker();
        }
    };

    const handleDateChange = async (date) => {
        if (!date) return;

        setDateFilter(date);
        setFilters('today');
        await loadMatches(date);
    };

    const handleClearDateFilter = async (e) => {
        e.stopPropagation();
        setDateFilter('');
        setFilters('all');
        await loadMatches();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleJoinMatch = async (matchId) => {
        try {
            const response = await MatchService.requestForMatch(matchId, userId);
            setMatches(prev =>
                prev.map(m =>
                    m.id === response.data.data.id ? response.data.data : m
                )
            );
        } catch(error) {
            console.log(error);
            setErrors(error);
        }
    };

    const handleCreateMatch = () => {
        navigate("/CreateMatch");
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'OPEN': return 'open';
            case 'FULL': return 'full';
            case 'ONGOING': return 'ongoing';
            case 'CANCELED': return 'canceled';
            case 'SCHEDULED': return 'scheduled';
            case 'ENDED': return 'ended';
            default: return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'OPEN': return 'Open';
            case 'FULL': return 'Full';
            case 'SCHEDULED': return 'Scheduled';
            case 'ONGOING': return 'Ongoing';
            case 'CANCELED': return 'Canceled';
            case 'ENDED': return 'Ended';
            default: return '';
        }
    };

    const getDisplayDate = () => {
        if (dateFilter) {
            return formatDate(dateFilter);
        }
        return 'Today';
    };

    return (
        <div className="matches-container">
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
                        className={`filter-btn ${filters === 'all' && !dateFilter ? 'active' : ''}`}
                        onClick={() => handleFilterClick('all')}
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faList}/> All Matches
                    </button>

                    <div className="date-filter-container">
                        <div
                            className={`date-filter-btn ${dateFilter ? 'has-date' : ''}`}
                            onClick={handleDateButtonClick}
                        >
                            <FontAwesomeIcon icon={faCalendarAlt} />
                            <span className="date-label">{getDisplayDate()}</span>
                            {dateFilter && (
                                <span
                                    className="clear-date"
                                    onClick={handleClearDateFilter}
                                >
                                    ×
                                </span>
                            )}
                        </div>
                        <input
                            ref={datePickerRef}
                            type="date"
                            value={dateFilter}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="date-picker-input"
                        />
                    </div>
                </div>

                <div className="search-box-match">
                    <FontAwesomeIcon icon={faSearch}/>
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

            {loading ? (
                <div className="loading-matches">
                    <div className="spinner"></div>
                    <p>Loading matches...</p>
                </div>
            ) : (
                <div className="matches-list">
                    {filteredMatches.length === 0 ? (
                        <div className="no-matches">
                            <p>No matches found{dateFilter ? ` for ${formatDate(dateFilter)}` : ''}.</p>
                            {dateFilter && (
                                <button
                                    className="clear-filter-btn"
                                    onClick={handleClearDateFilter}
                                >
                                    Clear Date Filter
                                </button>
                            )}
                        </div>
                    ) : (
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
                                            {!match.matchScheduledTime ?(
                                                <>
                                                    <span>Around time:</span> {formatTimeSimple(match.matchAroundTime)}
                                                </>
                                            ) : (
                                                <>
                                                    <span>Scheduled time:</span> {formatTimeSimple(match.matchScheduledTime)}
                                                </>
                                            )}
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
                                            <div className="current-players">
                                                <div className="players-label">Joined Players
                                                    ({match.players?.length || 0}/{match.freePosition + (match.players?.length || 0)}):
                                                </div>
                                                <div className="players-list">
                                                    <div
                                                        key={match.matchOrganizer?.id}
                                                        className="player-badge organizer"
                                                        title="Organizer"
                                                    >
                                                        <div className="player-avatar">
                                                            {match.matchOrganizer?.firstName?.charAt(0) || 'P'}
                                                        </div>
                                                        <div className="player-info">
                                                            <div className="player-name">
                                                                {match.matchOrganizer?.firstName || ''} {match.matchOrganizer?.lastName || ''}
                                                                <span className="organizer-tag">👑</span>
                                                            </div>
                                                            <div className="player-level">
                                                                {match.matchOrganizer?.level && (
                                                                    <span className={`level-badge level-${match.matchOrganizer.level.toLowerCase()}`}>
                                                                        {match.matchOrganizer.level}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {match.players?.map((player, index) => (
                                                        <div
                                                            key={player.id || index}
                                                            className="player-badge"
                                                            title="Player"
                                                        >
                                                            <div className="player-avatar">
                                                                {player.firstName?.charAt(0) || 'P'}
                                                            </div>
                                                            <div className="player-info">
                                                                <div className="player-name">
                                                                    {player.firstName} {player.lastName}
                                                                </div>
                                                                <div className="player-level">
                                                                    {player.level && (
                                                                        <span className={`level-badge level-${player.level.toLowerCase()}`}>
                                                                            {player.level}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {match.freePosition > 0 && (
                                                <div className="available-slots">
                                                    <div className="slots-label">Available Slots:</div>
                                                    <div className="slots-grid">
                                                        {[...Array(match.freePosition)].map((_, index) => (
                                                            <div key={`empty-${index}`} className="empty-slot">
                                                                <div className="slot-icon">+</div>
                                                                <div className="slot-label">Slot {(match.players?.length || 0) + index + 1}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="slots-progress">
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{
                                                            width: `${((match.players?.length || 0) / ((match.players?.length || 0) + match.freePosition)) * 100}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <div className="progress-text">
                                                    {match.players?.length || 0} of {(match.players?.length || 0) + match.freePosition} players joined
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="match-actions">
                                        {match.matchStatus === 'OPEN' && match.freePosition > 0 && match.matchOrganizer?.id !== userId && !isUserInMatch(match.id)  ? (
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
                                        ) : match.matchStatus === 'ONGOING' ? (
                                            <button
                                                className="action-btn details-btn"
                                                style={{flex: 1}}
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
            )}
        </div>
    );
};

export default Matches;