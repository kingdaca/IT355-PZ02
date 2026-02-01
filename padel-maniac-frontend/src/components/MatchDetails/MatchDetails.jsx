// MatchDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MatchDetails.css';

import MatchService from "../../services/MatchService";
import OfferService from "../../services/OfferService";

const MatchDetails = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = Number(localStorage.getItem("userId"));
    const [activeTab, setActiveTab] = useState('details'); // 'details' ili 'offers'
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [showAcceptModal, setShowAcceptModal] = useState(false);

    // Dohvati detalje meča
    const fetchMatchDetails = async () => {
        try {
            setLoading(true);
            const response = await MatchService.mathcDetails(matchId);
            setMatch(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching match details:', err);
            setError(err.response?.data?.message || 'Failed to load match details');
        }
    };

    const fetchOffers = async () => {
        try {
            const response = await OfferService.getOffersByMatchId(matchId);
            setOffers(response.data);
        } catch (err) {
            console.error('Error fetching offers:', err);
        } finally {
            setLoading(false);
        }
    };

    // Dohvati detalje meča prilikom mount-a
    useEffect(() => {
        if (matchId) {
            fetchMatchDetails();
            fetchOffers();
        }
    }, [matchId]);

    // Funkcija za join
    const handleJoinMatch = async () => {
        try {
            const response = await MatchService.joinMatch(matchId);
            alert('Successfully joined the match!');
            // Refresh match details nakon join-a
            fetchMatchDetails();
        } catch (err) {
            console.error('Error joining match:', err);
            alert(err.response?.data?.message || 'Failed to join match');
        }
    };

    const handleRemoveMatch = async () => {
        try {
            const response = await MatchService.removeMatch(matchId);
            navigate("/matches");
        } catch (err) {
            console.error('Error remove match:', err);
        }
    };

    // Prihvatanje ponude
    const handleAcceptOffer = async (offerId) => {
        try {
            await OfferService.acceptOffer(offerId);
            alert('✅ Offer accepted successfully!');
            setShowAcceptModal(false);
            setSelectedOffer(null);
            // Refresh offers
            fetchOffers();
            fetchMatchDetails(); // Refresh match details jer je sada odabran court
        } catch (err) {
            console.error('Error accepting offer:', err);
            alert(err.response?.data?.message || 'Failed to accept offer');
        }
    };

    // Odbijanje ponude
    const handleRejectOffer = async (offerId) => {
        if (window.confirm('Are you sure you want to reject this offer?')) {
            try {
                await OfferService.rejectOffer(offerId);
                alert('❌ Offer rejected!');
                fetchOffers();
            } catch (err) {
                console.error('Error rejecting offer:', err);
                alert(err.response?.data?.message || 'Failed to reject offer');
            }
        }
    };

    // Formatiranje vremena
    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.slice(0, 5);
    };

    // Formatiranje datuma
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Loading state
    if (loading) {
        return (
            <div className="match-details-loading">
                <div className="spinner"></div>
                <p>Loading match details...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="match-details-error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate('/matches')}>Back to Matches</button>
            </div>
        );
    }

    return (
        <div className="match-details-container">
            {/* Back button */}
            <button
                className="back-button"
                onClick={() => navigate('/matches')}
            >
                ← Back to Matches
            </button>

            {/* Match Header */}
            <div className="match-header">
                <h1>🎾 Match Details</h1>
                <div className="match-meta">
                    <span className="match-id">ID: {match.id}</span>
                    <span className={`match-status status-${match.matchStatus?.toLowerCase()}`}>
                        {match.matchStatus}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="match-tabs">
                <button
                    className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('details')}
                >
                    📋 Match Details
                </button>
                <button
                    className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
                    onClick={() => setActiveTab('offers')}
                >
                    💰 Court Offers ({offers.length})
                </button>
            </div>

            {/* Details Tab */}
            {activeTab === 'details' && (
                <>
                    {/* Match Info */}
                    <div className="match-info-grid">
                        <div className="info-card">
                            <h3>📅 Date & Time</h3>
                            <p className="date-primary">{formatDate(match.matchDay)}</p>
                            <p className="date-secondary">{formatTime(match.matchAroundTime)}</p>
                        </div>

                        <div className="info-card">
                            <h3>📍 Location</h3>
                            <p>{match.location}</p>
                            {match.court && (
                                <div className="court-info">
                                    <p><strong>Selected Court:</strong></p>
                                    <p>{match.court.courtName}</p>
                                    <p>{match.court.address}</p>
                                </div>
                            )}
                        </div>

                        <div className="info-card">
                            <h3>👥 Players</h3>
                            <p className="players-count">
                                {match.players?.length || 0} / {match.players?.length + match.freePosition}
                            </p>
                            <p className={match.freePosition > 0 ? 'available' : 'full'}>
                                {match.freePosition > 0
                                    ? `${match.freePosition} slots available`
                                    : 'Match is full'}
                            </p>
                        </div>
                    </div>

                    {/* Notes */}
                    {match.notes && (
                        <div className="match-notes">
                            <h3>📝 Notes</h3>
                            <p>{match.notes}</p>
                        </div>
                    )}

                    {/* Players Section */}
                    <div className="players-section">
                        <h2>Players in this Match</h2>

                        {/* Player List */}
                        <div className="players-list">
                            {match.players?.map(player => (
                                <div key={player.id} className="player-card">
                                    <div className="player-avatar">
                                        {player.firstName?.charAt(0)}
                                    </div>
                                    <div className="player-info">
                                        <h4>
                                            {player.firstName} {player.lastName}
                                            {player.id === match.matchOrganizer?.id && ' 👑'}
                                        </h4>
                                        <p>Level: {player.level}</p>
                                        {player.email && (
                                            <div className="contact-info">
                                                <p>Email: {player.email}</p>
                                                {player.phone && <p>Phone: {player.phone}</p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Join Button - prikaži ako ima slobodnih mesta */}
                        {match.freePosition > 0 && match.matchOrganizer.id !== userId && (
                            <div className="join-section">
                                <button
                                    className="join-button"
                                    onClick={handleJoinMatch}
                                >
                                    Join This Match
                                </button>
                                <p className="join-note">
                                    Click to join this match
                                </p>
                            </div>
                        )}
                        {match.matchOrganizer?.id === userId && (
                            <div className="remove-section">
                                <button
                                    className="remove-button"
                                    onClick={handleRemoveMatch}
                                >
                                    ❌ Remove Match
                                </button>
                                <p className="remove-note">
                                    This action cannot be undone
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Offers Tab */}
            {activeTab === 'offers' && (
                <div className="offers-section">
                    <div className="offers-header">
                        <h2>💰 Court Offers</h2>
                        <p className="offers-count">{offers.length} offer{offers.length !== 1 ? 's' : ''} received</p>
                    </div>

                    {offers.length === 0 ? (
                        <div className="no-offers">
                            <div className="no-offers-icon">💸</div>
                            <h3>No offers yet</h3>
                            <p>Courts haven't sent any offers for this match.</p>
                            {match.matchOrganizer?.id === userId && (
                                <p className="hint">Offers will appear here when courts send them.</p>
                            )}
                        </div>
                    ) : (
                        <div className="offers-list">
                            {offers.map(offer => (
                                <div key={offer.id} className={`offer-card status-${offer.status?.toLowerCase()}`}>
                                    <div className="offer-header">
                                        <div className="offer-court">
                                            <h3>{offer.court?.courtName || 'Unknown Court'}</h3>
                                            <span className="court-city">{offer.court?.city}</span>
                                        </div>
                                        <div className="offer-status">
                                            <span className={`status-badge status-${offer.status?.toLowerCase()}`}>
                                                {offer.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="offer-details">
                                        <div className="detail-row">
                                            <span className="detail-label">📍 Address:</span>
                                            <span className="detail-value">{offer.court?.address}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">📞 Phone:</span>
                                            <span className="detail-value">{offer.court?.phone}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">💰 Price:</span>
                                            <span className="detail-value price">{offer.offeredPrice} RSD</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">🕐 Offer Time:</span>
                                            <span className="detail-value">{formatTime(offer.offerTime)}</span>
                                        </div>
                                        {offer.notes && (
                                            <div className="detail-row">
                                                <span className="detail-label">📝 Notes:</span>
                                                <span className="detail-value notes">{offer.notes}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions - samo organizator može da prihvati/odbije */}
                                    {match.matchOrganizer?.id === userId && (
                                        <div className="offer-actions">
                                            {offer.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        className="btn-accept"
                                                        onClick={() => {
                                                            setSelectedOffer(offer);
                                                            setShowAcceptModal(true);
                                                        }}
                                                    >
                                                        ✅ Accept Offer
                                                    </button>
                                                    <button
                                                        className="btn-reject"
                                                        onClick={() => handleRejectOffer(offer.id)}
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                </>
                                            )}
                                            {offer.status === 'ACCEPTED' && (
                                                <div className="accepted-badge">
                                                    ✅ Accepted
                                                </div>
                                            )}
                                            {offer.status === 'REJECTED' && (
                                                <div className="rejected-badge">
                                                    ❌ Rejected
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Accept Offer Modal */}
            {showAcceptModal && selectedOffer && (
                <div className="modal-overlay">
                    <div className="accept-modal">
                        <div className="modal-header">
                            <h2>✅ Accept Offer</h2>
                            <button
                                className="modal-close"
                                onClick={() => {
                                    setShowAcceptModal(false);
                                    setSelectedOffer(null);
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-content">
                            <p>Are you sure you want to accept this offer?</p>

                            <div className="offer-summary">
                                <h4>Offer Details:</h4>
                                <div className="summary-item">
                                    <span>Court:</span>
                                    <strong>{selectedOffer.court?.courtName}</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Price:</span>
                                    <strong className="price">{selectedOffer.offeredPrice} RSD</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Time:</span>
                                    <strong>{formatTime(selectedOffer.offerTime)}</strong>
                                </div>
                                <div className="summary-item">
                                    <span>Address:</span>
                                    <strong>{selectedOffer.court?.address}</strong>
                                </div>
                            </div>

                            <div className="warning-note">
                                ⚠️ <strong>Note:</strong> Accepting this offer will automatically reject all other offers.
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={() => {
                                    setShowAcceptModal(false);
                                    setSelectedOffer(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-confirm"
                                onClick={() => handleAcceptOffer(selectedOffer.id)}
                            >
                                ✅ Yes, Accept Offer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchDetails;