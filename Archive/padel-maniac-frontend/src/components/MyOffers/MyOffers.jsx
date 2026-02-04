import React, { useState, useEffect } from 'react';
import './MyOffers.css';
import OfferService from "../../services/OfferService";

const MyOffers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchMyOffers();
    }, []);

    const fetchMyOffers = async () => {
        try {
            setLoading(true);
            // TODO: Implement API call
            const response = await OfferService.getOffersForCourt(Number(userId));
            setOffers(response.data.data);

            // Mock data for now
            // setOffers([]);

        } catch (err) {
            console.error('Error fetching offers:', err);
            setError('Failed to load your offers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOffer = async (offerId) =>{
        try {
            setLoading(true);
            // TODO: Implement API call
            const response = await OfferService.cancelOffer(offerId);
            console.log(response.data.data);


        } catch (err) {
            console.log(err)
        } finally {
            fetchMyOffers();
        }
    }

    const handleConfirmOffer= async (offerId) =>{
        try {
            setLoading(true);
            // TODO: Implement API call
            const response = await OfferService.confirmOffer(offerId);
            console.log(response.data.data);


        } catch (err) {
            console.log(err)
        } finally {
            fetchMyOffers();
        }
    }

    const filteredOffers = offers.filter(offer => {
        if (statusFilter === 'all') return true;
        return offer.status === statusFilter;
    });

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format time
    const formatTime = (timeString) => {
        if (!timeString) return '';
        return timeString.slice(0, 5);
    };

    // Loading state
    if (loading) {
        return (
            <div className="my-offers-loading">
                <div className="spinner"></div>
                <p>Loading your offers...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="my-offers-error">
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={fetchMyOffers}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="my-offers-container">
            {/* Header */}
            <div className="my-offers-header">
                <h1>My Offers</h1>
                <p>Track the status of all offers you've sent to matches</p>
            </div>

            {/* Stats Overview */}
            <div className="offers-stats">
                <div className="stat-card">
                    <div className="stat-number">{offers.length}</div>
                    <div className="stat-label">Total Offers</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">
                        {offers.filter(o => o.status === 'PENDING').length}
                    </div>
                    <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">
                        {offers.filter(o => o.status === 'ACCEPTED').length}
                    </div>
                    <div className="stat-label">Accepted</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">
                        {offers.filter(o => o.status === 'REJECTED').length}
                    </div>
                    <div className="stat-label">Rejected</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">
                        {offers.filter(o => o.status === 'CONFIRMED').length}
                    </div>
                    <div className="stat-label">Court Confirmed</div>
                </div>
            </div>

            {/* Filters */}
            <div className="offers-filters">
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        All Offers
                    </button>
                    <button
                        className={`filter-tab ${statusFilter === 'PENDING' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('PENDING')}
                    >
                        Pending
                    </button>
                    <button
                        className={`filter-tab ${statusFilter === 'ACCEPTED' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('ACCEPTED')}
                    >
                        Accepted
                    </button>
                    <button
                        className={`filter-tab ${statusFilter === 'CONFIRMED' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('CONFIRMED')}
                    >
                        Court Confirmed
                    </button>
                    <button
                        className={`filter-tab ${statusFilter === 'REJECTED' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('REJECTED')}
                    >
                        Rejected
                    </button>
                </div>
            </div>

            {/* Offers List */}
            <div className="offers-list-container">
                {filteredOffers.length > 0 ? (
                    <div className="offers-list">
                        {filteredOffers.map(offer => (
                            <div key={offer.id} className="offer-card">
                                {/* Offer Header */}
                                <div className="offer-header">
                                    <div className="offer-meta">
                                        <span className="offer-id">Offer #{offer.id}</span>
                                        <span className="offer-date">
                                            Sent: {formatDate(offer.offerTime)}
                                        </span>
                                    </div>
                                    <span className={`status-badge status-${offer.status.toLowerCase()}`}>
                                        {offer.status}
                                    </span>
                                </div>

                                {/* Match Info */}
                                <div className="match-info">
                                    <h3>Match Details</h3>
                                    <div className="match-details-grid">
                                        <div className="detail-item-offer">
                                            <span className="label">Date:</span>
                                            <span className="value">
                                                {formatDate(offer.match?.matchDay)}
                                            </span>
                                        </div>
                                        <div className="detail-item-offer">
                                            <span className="label">Time:</span>
                                            <span className="value">
                                                {formatTime(offer.match?.matchAroundTime)}
                                            </span>
                                        </div>
                                        <div className="detail-item-offer">
                                            <span className="label">Location:</span>
                                            <span className="value">
                                                {offer.match?.location|| 'Not specified'}
                                            </span>
                                        </div>
                                        <div className="detail-item-offer">
                                            <span className="label">Organizer:</span>
                                            <span className="value">
                                                {offer.match?.matchOrganizer?.firstName} {offer.match?.matchOrganizer?.lastName}
                                            </span>
                                        </div>
                                        <div className="detail-item-offer">
                                            <span className="label">Players:</span>
                                            <span className="value">
                                                {offer.match?.players?.length || 0}/{offer.match?.players?.length + offer.match?.freePosition}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Offer Details */}
                                <div className="offer-details">
                                    <h3>Your Offer Details</h3>
                                    <div className="offer-details-grid">
                                        <div className="detail-item-offer">
                                            <span className="label">Offered Price:</span>
                                            <span className="value price">{offer.offeredPrice} RSD/hour</span>
                                        </div>
                                        {offer.court?.basePrice && (
                                            <div className="detail-item-offer">
                                                <span className="label">Your Base Price:</span>
                                                <span className="value">{offer.court?.basePrice} RSD/hour</span>
                                            </div>
                                        )}
                                        <div className="detail-item-offer">
                                            <span className="label">Notes:</span>
                                            <span className="value">
                                                {offer.notes || 'No additional notes'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="offer-actions">
                                    {offer.status === 'PENDING' && (
                                        <button className="btn-cancel-offer"
                                                onClick={() => handleCancelOffer(offer.id)}>
                                            Cancel Offer
                                        </button>
                                    )}
                                    {offer.status === 'ACCEPTED' && (
                                        <div className="accepted-info">
                                            <span className="success-icon">✅</span>
                                            <span>This court has been booked for the match!</span>
                                        </div>
                                    )}
                                    {offer.status === 'CONFIRMED' && (
                                        <div className="confirmed-info">
                                            <span className="court-icon">🏛️</span>
                                            <span>
                                                Court confirmed! The sports court has officially approved this booking.
                                                {offer.court?.confirmedBy && ` Confirmed by: ${offer.court.confirmedBy}`}
                                            </span>
                                        </div>
                                    )}
                                    {offer.status === 'REJECTED' && (
                                        <div className="rejected-info">
                                            <span className="reject-icon">❌</span>
                                            <span>Your offer was not selected for this match.</span>
                                        </div>
                                    )}
                                    {offer.status === 'ACCEPTED' && (
                                        <button className="btn-view-match"
                                        onClick={() => handleConfirmOffer(offer.id)}>
                                        Confirm your offer
                                    </button>)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-offers">
                        <div className="no-offers-icon">📭</div>
                        <h3>No offers found</h3>
                        <p>
                            {statusFilter === 'all'
                                ? "You haven't sent any offers yet. Go to 'Send Offers' to make your first offer!"
                                : `No ${statusFilter.toLowerCase()} offers found.`
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOffers;