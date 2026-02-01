import React, { useState, useEffect } from 'react';
import {useFetcher, useNavigate} from 'react-router-dom';
import './SendOffer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarAlt,
    faMapMarkerAlt,
    faUsers,
    faClock,
    faMoneyBillWave,
    faPaperPlane,
    faInfoCircle,
    faTableTennisPaddleBall,
    faUser,
    faPhone
} from '@fortawesome/free-solid-svg-icons';
import MatchService from '../../services/MatchService';
import OfferService from '../../services/OfferService';

const SendOffer = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [offerPrice, setOfferPrice] = useState('');
    const [offerNotes, setOfferNotes] = useState('');
    const [offerTime, setOfferTime] = useState('');
    const [sendingOffer, setSendingOffer] = useState(false);
    const [courtId, setCourtId] = useState(null); // Samo ID treba

    useEffect(() => {
        if(localStorage.getItem("role") === "PLAYER"){
            navigate("/HomePage");
        }
    }, []);

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            setLoading(true);

            // Fetch upcoming matches
            const matchesResponse = await MatchService.getUpcomingMatches();

            // Filter matches: only OPEN, future, without selected court
            const filteredMatches = matchesResponse.data.filter(match => {
                const matchDate = new Date(match.matchDay);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                return match.matchStatus === 'FULL' &&
                    !match.selectedCourt &&
                    matchDate >= today;
            });

            setMatches(filteredMatches);

        } catch (err) {
            console.error('Error fetching matches:', err);
            setError('Failed to load matches. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };


    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.slice(0, 5);
    };


    const handleSendOffer = async () => {
        if (!selectedMatch || !offerPrice || offerPrice <= 0) {
            alert('Please enter a valid price');
            return;
        }

        try {
            setSendingOffer(true);

           const response =  await OfferService.createOffer({
                matchId: selectedMatch.id,
                userId: Number(localStorage.getItem("userId")),
                price: parseFloat(offerPrice),
                time: offerTime,
                notes: offerNotes
            });

            alert('✅ Offer sent successfully!');
            console.log("resp", response);
            // Close modal and reset
            setShowOfferModal(false);
            setSelectedMatch(null);
            setOfferPrice('');
            setOfferNotes('');
            setOfferTime('');

            // Refresh matches (remove the one we just offered to)
            setMatches(prev => prev.filter(m => m.id !== selectedMatch.id));

        } catch (err) {
            console.error('Error sending offer:', err);
            alert(err.response?.data?.message || 'Failed to send offer. Please try again.');
        } finally {
            setSendingOffer(false);
        }
    };


    const openOfferModal = (match) => {
        setSelectedMatch(match);
        // Set default price (možete prilagoditi ovu vrednost)
        const defaultPrice = ''; // Ili neku default vrednost ako je potrebno
        setOfferPrice(defaultPrice);
        setOfferTime(match.matchAroundTime);
        setOfferNotes('');
        setShowOfferModal(true);
    };


    if (loading) {
        return (
            <div className="send-offer-loading">
                <div className="spinner"></div>
                <p>Loading upcoming matches...</p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="send-offer-error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={fetchMatches}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="send-offer-container">
            {/* Header */}
            <div className="send-offer-header">
                <div className="court-info">
                    <h1>
                        <FontAwesomeIcon icon={faTableTennisPaddleBall} />
                        Send Offers to Matches
                    </h1>
                    <p className="instruction">
                        Browse upcoming matches and send competitive offers to get your court booked!
                    </p>
                </div>

                <div className="court-stats">
                    <div className="stat-card">
                        <div className="stat-number">{matches.length}</div>
                        <div className="stat-label">Available Matches</div>
                    </div>
                </div>
            </div>

            <div className="matches-table-container">
                {matches.length > 0 ? (
                    <>
                        <div className="table-header">
                            <h3>Upcoming Matches Available for Offers</h3>
                            <span className="matches-count">
                                {matches.length} match{matches.length !== 1 ? 'es' : ''} found
                            </span>
                        </div>

                        <div className="matches-table">
                            <div className="table-header-row">
                                <div className="col-date">Date & Time</div>
                                <div className="col-location">Location</div>
                                <div className="col-organizer">Organizer</div>
                                <div className="col-action">Action</div>
                            </div>

                            {matches.map(match => (
                                <div key={match.id} className="table-row">
                                    <div className="col-date">
                                        <div className="date-primary">{formatDate(match.matchDay)}</div>
                                        <div className="date-secondary">
                                            <FontAwesomeIcon icon={faClock} />
                                            {formatTime(match.matchAroundTime)}
                                        </div>
                                    </div>

                                    <div className="col-location">
                                        <div className="location-city">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                                            {match.location || 'Not specified'}
                                        </div>
                                        {match.notes && (
                                            <div className="location-notes" title={match.notes}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                {match.notes.length > 30
                                                    ? `${match.notes.substring(0, 30)}...`
                                                    : match.notes}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-organizer">
                                        <div className="organizer-name">
                                            <FontAwesomeIcon icon={faUser} />
                                            {match.matchOrganizer?.firstName} {match.matchOrganizer?.lastName}
                                        </div>
                                        <div className="organizer-level">
                                            {match.matchOrganizer?.level && (
                                                <span className={`level-badge level-${match.matchOrganizer.level.toLowerCase()}`}>
                                                    {match.matchOrganizer.level}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-action">
                                        <button
                                            className="btn-send-offer"
                                            onClick={() => openOfferModal(match)}
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                            Send Offer
                                        </button>
                                        <button
                                            className="btn-view-details"
                                            onClick={() => navigate(`/match/${match.id}`)}
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-matches">
                        <div className="no-matches-icon">
                            <FontAwesomeIcon icon={faTableTennisPaddleBall} size="3x" />
                        </div>
                        <h3>No matches available for offers</h3>
                        <p>
                            All upcoming matches already have offers or are in the past.
                            Check back later for new matches!
                        </p>
                        <button
                            className="btn-refresh"
                            onClick={fetchMatches}
                        >
                            Refresh
                        </button>
                    </div>
                )}
            </div>


            {showOfferModal && selectedMatch && (
                <div className="modal-overlay">
                    <div className="offer-modal">
                        <div className="modal-header">
                            <h2>
                                <FontAwesomeIcon icon={faPaperPlane} />
                                Send Offer for Match
                            </h2>
                            <button
                                className="modal-close"
                                onClick={() => setShowOfferModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-content">
                            {/* Match Info */}
                            <div className="match-summary">
                                <h4>Match Details:</h4>
                                <div className="match-info-grid">
                                    <div className="info-item">
                                        <span className="label">Date:</span>
                                        <span className="value">{formatDate(selectedMatch.matchDay)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Time:</span>
                                        <span className="value">{formatTime(selectedMatch.matchAroundTime)}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Location:</span>
                                        <span className="value">{selectedMatch.location || 'Not specified'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Organizer:</span>
                                        <span className="value">
                                            {selectedMatch.matchOrganizer?.firstName} {selectedMatch.matchOrganizer?.lastName}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Players:</span>
                                        <span className="value">
                                            {selectedMatch.players?.length || 0}/{selectedMatch.players?.length + selectedMatch.freePosition}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Offer Form */}
                            <div className="offer-form">
                                <h4>Your Offer:</h4>

                                <div className="form-group">
                                    <label htmlFor="offer-time">
                                        <FontAwesomeIcon icon={faClock}/>
                                        Offer Time (HH:MM) *
                                    </label>
                                    <div className="time-input-group">
                                        <input
                                            id="offer-time"
                                            type="time"
                                            value={offerTime}
                                            onChange={(e) => setOfferTime(e.target.value)}
                                            required
                                        />
                                        <span className="time-format">24h format</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="offer-price">
                                        <FontAwesomeIcon icon={faMoneyBillWave}/>
                                        Offer Price (RSD/hour) *
                                    </label>
                                    <div className="price-input-group">
                                        <input
                                            id="offer-price"
                                            type="number"
                                            min="1"
                                            step="100"
                                            value={offerPrice}
                                            onChange={(e) => setOfferPrice(e.target.value)}
                                            placeholder="Enter your competitive price"
                                            required
                                        />
                                        <span className="currency">RSD</span>
                                    </div>
                                </div>

                                <div className="form-group notes">
                                    <label htmlFor="offer-notes">
                                        <FontAwesomeIcon icon={faInfoCircle}/>
                                        Additional Notes (Optional)
                                    </label>
                                    <textarea
                                        id="offer-notes"
                                        value={offerNotes}
                                        onChange={(e) => setOfferNotes(e.target.value)}
                                        placeholder="Add any special notes, promotions, or conditions..."
                                        rows="3"
                                        maxLength="500"
                                    />
                                    <div className="char-count">{offerNotes.length}/500 characters</div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowOfferModal(false)}
                                disabled={sendingOffer}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-send"
                                onClick={handleSendOffer}
                                disabled={sendingOffer || !offerPrice || !offerTime}
                            >
                                {sendingOffer ? (
                                    <>
                                        <span className="spinner-small"></span>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faPaperPlane} />
                                        Send Offer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SendOffer;