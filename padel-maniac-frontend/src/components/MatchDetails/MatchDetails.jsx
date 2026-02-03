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
    const [activeTab, setActiveTab] = useState('details');
    const [showVoteChangeModal, setShowVoteChangeModal] = useState(false);
    const [offerToVote, setOfferToVote] = useState(null);
    const [userVotes, setUserVotes] = useState({});
    const [voteStats, setVoteStats] = useState({
        totalPlayers: 0,
        hasVoted: false,
        userVoteForOffer: null
    });

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
            const offersData = response.data;
            setOffers(offersData);

            // Inicijalizuj userVotes i statistike
            const votesMap = {};
            let userHasVoted = false;
            let userVoteForOfferId = null;

            offersData.forEach(offer => {
                if (offer.votes && Array.isArray(offer.votes)) {
                    // Proveri da li je trenutni user glasao za ovu ponudu
                    const hasUserVotedForThis = offer.votes.some(vote => vote.player?.id === userId);
                    votesMap[offer.id] = hasUserVotedForThis;

                    if (hasUserVotedForThis) {
                        userHasVoted = true;
                        userVoteForOfferId = offer.id;
                    }
                }
            });

            setUserVotes(votesMap);
            setVoteStats({
                totalPlayers: match?.players?.length || 0,
                hasVoted: userHasVoted,
                userVoteForOffer: userVoteForOfferId
            });

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
        }
    }, [matchId]);

    // Kada se match učita, učitaj ponude
    useEffect(() => {
        if (match) {
            fetchOffers();
        }
    }, [match]);

    // Funkcija za join
    const handleJoinMatch = async () => {
        try {
            await MatchService.joinMatch(matchId);
            alert('Successfully joined the match!');
            fetchMatchDetails();
        } catch (err) {
            console.error('Error joining match:', err);
            alert(err.response?.data?.message || 'Failed to join match');
        }
    };

    const handleRemoveMatch = async () => {
        try {
            await MatchService.removeMatch(matchId);
            navigate("/matches");
        } catch (err) {
            console.error('Error remove match:', err);
            alert(err.response?.data?.message || 'Failed to remove match');
        }
    };

    // Glasanje za ponudu
    const handleVoteForOffer = async (offerId) => {
        // Ako je ponuda već prihvaćena ili odbijena, ne može se glasati
        const offer = offers.find(o => o.id === offerId);
        if (offer && offer.status !== 'PENDING') {
            alert(`Cannot vote for ${offer.status.toLowerCase()} offer`);
            return;
        }

        try {
            // Proveri da li je user već glasao za neku drugu ponudu
            if (voteStats.hasVoted && voteStats.userVoteForOffer !== offerId) {
                // Ako je već glasao, pitaj da li želi da promeni glas
                setOfferToVote(offerId);
                setShowVoteChangeModal(true);
                return;
            }

            // Ako nije glasao, direktno glasaj
            await performVote(offerId);

        } catch (err) {
            console.error('Error voting for offer:', err);
            alert(err.response?.data?.message || 'Failed to vote for offer');
        }
    };

    // Izvrši glasanje
    const performVote = async (offerId) => {
        try {
            const RequestOfferVoteDTO = {
                offerId: offerId,
                playerId: userId
            };

            await OfferService.vote(RequestOfferVoteDTO);

            // Ažuriraj userVotes - postavi ovaj offer na true, sve ostale na false
            const newUserVotes = {};
            offers.forEach(offer => {
                newUserVotes[offer.id] = offer.id === offerId;
            });
            setUserVotes(newUserVotes);

            // Ažuriraj statistike
            setVoteStats(prev => ({
                ...prev,
                hasVoted: true,
                userVoteForOffer: offerId
            }));

            // Osveži ponude
            fetchOffers();

            alert('✅ Vote submitted successfully!');
        } catch (err) {
            console.error('Error performing vote:', err);
            alert(err.response?.data?.message || 'Failed to submit vote');
        }
    };

    // Potvrdi promenu glasa
    const confirmVoteChange = async () => {
        if (offerToVote) {
            await performVote(offerToVote);
            setShowVoteChangeModal(false);
            setOfferToVote(null);
        }
    };

    // Odbaci promenu glasa
    const cancelVoteChange = () => {
        setShowVoteChangeModal(false);
        setOfferToVote(null);
    };

    // Proveri da li je user učesnik u meču
    const isParticipant = match?.players?.some(p => p.id === userId);
    const isOrganizer = match?.matchOrganizer?.id === userId;

    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.slice(0, 5);
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

    // Pronađi ponudu sa najviše glasova
    const getWinningOffer = () => {
        if (offers.length === 0) return null;

        let maxVotes = 0;
        let winningOffers = [];

        offers.forEach(offer => {
            const voteCount = offer.votes?.length || 0;
            if (voteCount > maxVotes) {
                maxVotes = voteCount;
                winningOffers = [offer];
            } else if (voteCount === maxVotes && voteCount > 0) {
                winningOffers.push(offer);
            }
        });

        // Ako ima više ponuda sa istim brojem glasova
        if (winningOffers.length > 1) {
            return {
                isTie: true,
                offers: winningOffers,
                voteCount: maxVotes
            };
        }

        return {
            isTie: false,
            offer: winningOffers[0],
            voteCount: maxVotes
        };
    };

    if (loading) {
        return (
            <div className="match-details-loading">
                <div className="spinner"></div>
                <p>Loading match details...</p>
            </div>
        );
    }

    if (error || !match) {
        return (
            <div className="match-details-error">
                <h2>Error</h2>
                <p>{error || 'Match not found'}</p>
                <button onClick={() => navigate('/matches')}>Back to Matches</button>
            </div>
        );
    }

    const winningOffer = getWinningOffer();

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
                {(isParticipant || isOrganizer) && (
                    <button
                        className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('offers')}
                    >
                        💰 Courts Offers ({offers.length})
                    </button>
                )}
            </div>

            {/* Details Tab */}
            {activeTab === 'details' && (
                <>
                    {/* Match Info */}
                    <div className="match-info-grid">
                        <div className="info-card">
                            <h3>📅 Date & Around Time</h3>
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

                        {/* Join Button */}
                        {match.freePosition > 0 && match.matchOrganizer.id !== userId && !isParticipant && (
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

                        {/* Remove Button - samo za organizatora */}
                        {isOrganizer && (
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
                        <div className="voting-info">
                            <p className="offers-count">{offers.length} offer{offers.length !== 1 ? 's' : ''} received</p>

                            {/* Voting Instructions */}
                            <p className="voting-instruction">
                                👆 <strong>Voting System:</strong> All players vote for their preferred court.
                                The offer with the most votes wins!
                            </p>

                            {/* Winning Offer Info */}
                            {winningOffer && winningOffer.voteCount > 0 && (
                                <div className="winning-offer-info">
                                    {winningOffer.isTie ? (
                                        <div className="tie-warning">
                                            ⚠️ <strong>Tie!</strong> {winningOffer.offers.length} offers have {winningOffer.voteCount} votes each
                                        </div>
                                    ) : (
                                        <div className="leading-offer">
                                            🏆 <strong>Leading:</strong> {winningOffer.offer.court?.courtName}
                                            with {winningOffer.voteCount} vote{winningOffer.voteCount !== 1 ? 's' : ''}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* User Voting Status */}
                            {isParticipant && (
                                <div className="user-vote-status">
                                    {voteStats.hasVoted ? (
                                        <span className="voted-status">
                                            ✅ You have voted for: {offers.find(o => o.id === voteStats.userVoteForOffer)?.court?.courtName || 'an offer'}
                                        </span>
                                    ) : (
                                        <span className="not-voted-status">
                                            ⏳ You haven't voted yet. Cast your vote below!
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {offers.length === 0 ? (
                        <div className="no-offers">
                            <div className="no-offers-icon">💸</div>
                            <h3>No offers yet</h3>
                            <p>Courts haven't sent any offers for this match.</p>
                        </div>
                    ) : (
                        <div className="offers-list">
                            {offers.map(offer => {
                                const hasUserVotedForThis = userVotes[offer.id] === true;
                                const userVoteCount = offer.votes?.length || 0;
                                const totalPlayers = (match.players?.length + 1) || 0;
                                const isWinning = winningOffer && !winningOffer.isTie &&
                                    winningOffer.offer?.id === offer.id;
                                const isTied = winningOffer?.isTie &&
                                    winningOffer.offers.some(o => o.id === offer.id);

                                return (
                                    <div key={offer.id} className={`offer-card status-${offer.status?.toLowerCase()} ${isWinning ? 'winning' : ''} ${isTied ? 'tied' : ''}`}>
                                        {/* Winning/Tied Badge */}
                                        {isWinning && (
                                            <div className="winning-badge">
                                                🏆 Leading with {winningOffer.voteCount} votes
                                            </div>
                                        )}
                                        {isTied && (
                                            <div className="tied-badge">
                                                ⚖️ Tied with {winningOffer.voteCount} votes
                                            </div>
                                        )}

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

                                            {/* Voting Stats */}
                                            <div className="detail-row voting-stats-row">
                                                <span className="detail-label">👍 Votes:</span>
                                                <div className="voting-details">
                                                    <div className="vote-progress">
                                                        <div className="progress-bar">
                                                            <div
                                                                className="progress-fill"
                                                                style={{
                                                                    width: `${totalPlayers > 0 ? (userVoteCount / totalPlayers * 100) : 0}%`
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="votes-count">
                                                            {userVoteCount} of {totalPlayers} players ({totalPlayers > 0 ? Math.round(userVoteCount / totalPlayers * 100) : 0}%)
                                                        </span>
                                                    </div>
                                                    {offer.votes && offer.votes.length > 0 && (
                                                        <div className="voters-list">
                                                            {offer.votes.map((vote, index) => (
                                                                <div key={index} className="voter-badge" title={`${vote.player?.firstName} ${vote.player?.lastName}`}>
                                                                    <div className="voter-avatar">
                                                                        {vote.player?.firstName?.charAt(0) || 'U'}
                                                                    </div>
                                                                    <span className="voter-name">
                                                                        {vote.player?.firstName} {vote.player?.lastName}
                                                                        {vote.player?.id === userId && ' (You)'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Voting Actions - za sve učesnike */}
                                        <div className="offer-actions">
                                            {offer.status === 'PENDING' && isParticipant && (
                                                <>
                                                    {hasUserVotedForThis ? (
                                                        <div className="vote-status">
                                                            <span className="voted-badge">✅ You voted for this offer</span>
                                                            <button
                                                                className="btn-change-vote"
                                                                onClick={() => handleVoteForOffer(offer.id)}
                                                            >
                                                                Change Vote
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="btn-vote"
                                                            onClick={() => handleVoteForOffer(offer.id)}
                                                        >
                                                            👍 Vote for this Court
                                                        </button>
                                                    )}
                                                </>
                                            )}

                                            {/* Ako nije učesnik */}
                                            {offer.status === 'PENDING' && !isParticipant && (
                                                <div className="info-message">
                                                    Only match participants can vote for offers
                                                </div>
                                            )}

                                            {offer.status === 'ACCEPTED' && (
                                                <div className="accepted-badge">
                                                    ✅ Accepted (Most votes: {offer.votes?.length || 0})
                                                </div>
                                            )}

                                            {offer.status === 'REJECTED' && (
                                                <div className="rejected-badge">
                                                    ❌ Rejected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Change Vote Modal */}
            {showVoteChangeModal && (
                <div className="modal-overlay">
                    <div className="accept-modal">
                        <div className="modal-header">
                            <h2>🔄 Change Vote</h2>
                            <button
                                className="modal-close"
                                onClick={cancelVoteChange}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modal-content">
                            <p>You have already voted for another offer.</p>
                            <p>Are you sure you want to change your vote?</p>

                            <div className="warning-note">
                                ⚠️ <strong>Note:</strong> Changing your vote will remove your previous vote and may affect which court wins!
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={cancelVoteChange}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-confirm"
                                onClick={confirmVoteChange}
                            >
                                ✅ Yes, Change Vote
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MatchDetails;