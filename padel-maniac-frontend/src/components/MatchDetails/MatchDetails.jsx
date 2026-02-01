// MatchDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MatchDetails.css';

import MatchService from "../../services/MatchService";

const MatchDetails = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = Number(localStorage.getItem("userId"));
    // Dohvati detalje meča
    const fetchMatchDetails = async () => {
        try {
            setLoading(true);
            console.log(("aaaaa"))
            const response = await MatchService.mathcDetails(matchId);
            setMatch(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching match details:', err);
            setError(err.response?.data?.message || 'Failed to load match details');
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

    const handleRemoveMatch = async () =>{
        try {
            const response = MatchService.removeMatch(matchId);
            navigate("/matches");
        }catch (err){
            console.error('Error remove match:', err);
        }

    }

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
                    <span className="match-status">{match.matchStatus}</span>
                </div>
            </div>

            {/* Match Info */}
            <div className="match-info-grid">
                <div className="info-card">
                    <h3>📅 Date & Time Around</h3>
                    <p>{new Date(match.matchDay).toLocaleDateString()}</p>
                    <p>{match.matchAroundTime}</p>
                </div>

                <div className="info-card">
                    <h3>📍 Location</h3>
                    <p>{match.location}</p>
                    {match.court && <p>Court: {match.court.name}</p>}
                </div>

                <div className="info-card">
                    <h3>👥 Players</h3>
                    <p>{match.players?.length || 0} / {match.players?.length + match.freePosition}</p>
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
                                {/* Prikaži kontakt info samo ako je player objekat sadrži ove podatke */}
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
                {match.freePosition > 0 && match.matchOrganizer.id !== userId &&   (
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
        </div>
    );
};

export default MatchDetails;