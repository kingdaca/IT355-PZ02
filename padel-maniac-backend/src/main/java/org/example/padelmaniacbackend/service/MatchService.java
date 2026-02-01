package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTO.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.DTO.matchDTO.MatchDTO;
import org.example.padelmaniacbackend.DTO.playerDTO.PlayerDTO;
import org.example.padelmaniacbackend.model.Match;

import java.util.List;

public interface MatchService {

    public void createNewMatch(CreateMatchDTO createMatchDTO, String username);

    public List<MatchDTO> getMatches();

    public MatchDTO joinToMatch(Long matchId, String username);

    public MatchDTO matchDetails(Long matchId);

    public MatchDTO removeMatch(Long matchId);
}
