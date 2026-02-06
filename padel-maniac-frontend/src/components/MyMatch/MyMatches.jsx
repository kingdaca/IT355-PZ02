import React, {useEffect, useState} from "react";
import "./MyMatches.css"
import MatchService from "../../services/MatchService";
import AuthService from "../../services/AuthService";

const MyMatches = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const role = localStorage.getItem("role")
    const userId = Number(localStorage.getItem("userId"))

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        try {
            setLoading(true);
            const response = await MatchService.getMyMatches(userId);
            const allMatches = response.data.data || [];

            // Filtriranje mečeva na osnovu role
            let filteredMatches = [];

            if (role === 'COURT_OWNER') {
                filteredMatches = allMatches.filter(match => match.court);
            } else {

                filteredMatches = allMatches.filter(match =>
                    match.matchOrganizer && match.matchOrganizer.id === userId
                );
            }

            setMatches(filteredMatches);
        } catch (error) {
            console.error("Error loading matches:", error);
            setError("Failed to load matches. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusChange = async (matchId, newStatus) => {
        try {
            await MatchService.updateMatchStatus(matchId, { status: newStatus });
            await loadMatches();
        } catch (error) {
            console.error("Error updating match status:", error);
            alert("Failed to update match status");
        }
    };

    const handleDeleteMatch = async (matchId) => {
        if (!window.confirm("Are you sure you want to delete this match?")) {
            return;
        }

        try {
            await MatchService.deleteMatch(matchId);
            await loadMatches();
        } catch (error) {
            console.error("Error deleting match:", error);
            alert("Failed to delete match");
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { class: "badge-pending", text: "Pending" },
            confirmed: { class: "badge-confirmed", text: "Confirmed" },
            cancelled: { class: "badge-cancelled", text: "Cancelled" },
            completed: { class: "badge-completed", text: "Completed" }
        };

        const config = statusConfig[status] || { class: "badge-pending", text: status };
        return <span className={`status-badge ${config.class}`}>{config.text}</span>;
    };

    const filteredMatches = filterStatus === "all"
        ? matches
        : matches.filter(match => match.matchStatus === filterStatus);

    return (
        <div className="my-matches-container">
            <div className="page-header">
                <h1>
                    {role === 'COURT_OWNER' ? '🎾 Scheduled Matches' : '🎾 My Created Matches'}
                </h1>
                <div className="header-actions">
                    <select
                        className="filter-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                    <button className="btn-refresh" onClick={loadMatches} disabled={loading}>
                        {loading ? "Refreshing..." : "Refresh"}
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            {loading ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Loading matches...</p>
                </div>
            ) : filteredMatches.length === 0 ? (
                <div className="no-matches">
                    <p>No matches found.</p>
                    {filterStatus !== "all" && (
                        <button
                            className="btn-clear-filter"
                            onClick={() => setFilterStatus("all")}
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            ) : (
                <div className="matches-grid">
                    {filteredMatches.map(match => (
                        <div key={match.id} className="match-card">
                            <div className="match-card-header">
                                <div className="match-date">
                                    <span className="date-icon">📅</span>
                                    {formatDate(match.matchDay + 'T' + match.matchAroundTime)}
                                </div>
                                {getStatusBadge(match.matchStatus)}
                            </div>

                            <div className="match-card-body">
                                <div className="match-detail">
                                    <span className="detail-label">Location:</span>
                                    <span className="detail-value">{match.location}</span>
                                </div>

                                <div className="match-detail">
                                    <span className="detail-label">Players:</span>
                                    <span className="detail-value">
                                        {match.players ? match.players.length : 0} / {match.freePosition + (match.players ? match.players.length : 0)}
                                    </span>
                                </div>

                                <div className="match-detail">
                                    <span className="detail-label">Free Positions:</span>
                                    <span className="detail-value">{match.freePosition}</span>
                                </div>

                                <div className="match-detail">
                                    <span className="detail-label">Duration:</span>
                                    <span className="detail-value">{match.matchDuration} hours</span>
                                </div>

                                <div className="match-detail">
                                    <span className="detail-label">Reservation:</span>
                                    <span className={`detail-value ${match.needReservation ? 'reserved' : 'need-offer'}`}>
                                        {match.needReservation ? '✅ Reserved' : '⚠️ Needs Offer'}
                                    </span>
                                </div>

                                {match.court && (
                                    <div className="match-detail">
                                        <span className="detail-label">Court:</span>
                                        <span className="detail-value">
                                            {match.court.city}, {match.court.courtName}
                                        </span>
                                    </div>
                                )}

                                {match.notes && (
                                    <div className="match-detail full-width">
                                        <span className="detail-label">Notes:</span>
                                        <div className="notes-content">{match.notes}</div>
                                    </div>
                                )}

                                {role === 'COURT_OWNER' && match.matchOrganizer && (
                                    <div className="match-detail">
                                        <span className="detail-label">Organizer:</span>
                                        <span className="detail-value">
                                            {match.matchOrganizer.firstName} {match.matchOrganizer.lastName}
                                        </span>
                                    </div>
                                )}

                                {match.players && match.players.length > 0 && (
                                    <div className="match-detail full-width">
                                        <span className="detail-label">Players:</span>
                                        <div className="players-list">
                                            {match.players.map((player, index) => (
                                                <div key={index} className="player-item">
                                                    {player.firstName} {player.lastName}
                                                    {player.id === userId && <span className="you-badge"> (You)</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="match-card-footer">
                                {role === 'COURT_OWNER' ? (
                                    <div className="court-owner-actions">
                                        {match.matchStatus === 'pending' && (
                                            <>
                                                <button
                                                    className="btn-action btn-confirm"
                                                    onClick={() => handleStatusChange(match.id, 'confirmed')}
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    className="btn-action btn-cancel"
                                                    onClick={() => handleStatusChange(match.id, 'cancelled')}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {match.matchStatus === 'confirmed' && (
                                            <button
                                                className="btn-action btn-complete"
                                                onClick={() => handleStatusChange(match.id, 'completed')}
                                            >
                                                Complete
                                            </button>
                                        )}
                                        <button
                                            className="btn-action btn-delete"
                                            onClick={() => handleDeleteMatch(match.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ) : (
                                    <div className="user-actions">
                                        {(match.matchStatus === 'pending' || match.matchStatus === 'confirmed') && (
                                            <button
                                                className="btn-action btn-cancel"
                                                onClick={() => handleStatusChange(match.id, 'cancelled')}
                                            >
                                                Cancel Match
                                            </button>
                                        )}
                                        <button
                                            className="btn-action btn-delete"
                                            onClick={() => handleDeleteMatch(match.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyMatches;