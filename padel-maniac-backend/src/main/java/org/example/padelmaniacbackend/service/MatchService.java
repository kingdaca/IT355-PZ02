package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTOs.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchDTO;

import java.util.List;

public interface MatchService {

    public void createNewMatch(CreateMatchDTO createMatchDTO, String username);

    public List<MatchDTO> getMatches();

    public MatchDTO joinToMatch(Long matchId, String username);

    public MatchDTO matchDetails(Long matchId);

    public MatchDTO removeMatch(Long matchId);

    public List<MatchDTO> getUpcomingMatches();
}
