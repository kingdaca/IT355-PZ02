package org.example.padelmaniacbackend.service.impl;

import jakarta.transaction.Transactional;
import org.example.padelmaniacbackend.DTO.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.model.City;
import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.model.Player;
import org.example.padelmaniacbackend.repository.CityRepository;
import org.example.padelmaniacbackend.repository.MatchRepository;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@Transactional
public class MatchServiceImpl implements MatchService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private CityRepository cityRepository;

    @Override
    public void createNewMatch(CreateMatchDTO createMatchDTO) {
        Match m = new Match();
        Player p = playerRepository.findByUsername(createMatchDTO.getUsername());
        ArrayList<Player> players = new ArrayList<>();
        players.add(p);
        m.setMatchDay(createMatchDTO.getDate());
        m.setLocation(cityRepository.findByName(createMatchDTO.getCity()));
        m.setNotes(createMatchDTO.getNotes());
        m.setFreePosition(createMatchDTO.getNumberOfPlayers());
        m.setPlayers(players);
        matchRepository.save(m);
    }
}
