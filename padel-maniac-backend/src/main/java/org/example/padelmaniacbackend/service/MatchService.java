package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTOs.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchUnsubscribeOrJoinDTO;

import java.util.List;

public interface MatchService {

    public void createNewMatch(CreateMatchDTO createMatchDTO, String username);

    public List<MatchDTO> getMatches();

    public MatchDTO joinToMatch(MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO);

    public MatchDTO requestForMatch(MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO);

    public MatchDTO rejectRequest(MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO);

    public MatchDTO matchDetails(Long matchId);

    public MatchDTO removeMatch(Long matchId);

    public List<MatchDTO> getUpcomingMatches(Long playerId);

    public MatchDTO matchUnsubscribe(MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO);
}
