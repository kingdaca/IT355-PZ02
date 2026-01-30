package org.example.padelmaniacbackend.service.impl;

import jakarta.transaction.Transactional;
import org.example.padelmaniacbackend.DTO.City.CityDTO;
import org.example.padelmaniacbackend.DTO.Court.CourtDTO;
import org.example.padelmaniacbackend.DTO.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.DTO.matchDTO.MatchDTO;
import org.example.padelmaniacbackend.DTO.playerDTO.PlayerDTO;
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
import java.util.List;
import java.util.stream.Collectors;

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
    public void createNewMatch(CreateMatchDTO createMatchDTO, String username) {
        Match m = new Match();
        Player p = playerRepository.findByUsername(username);
        ArrayList<Player> players = new ArrayList<>();
        players.add(p);
        m.setMatchDay(createMatchDTO.getDate());
        m.setLocation(cityRepository.findByName(createMatchDTO.getCity()));
        m.setNotes(createMatchDTO.getNotes());
        m.setFreePosition(createMatchDTO.getNumberOfPlayers());
        m.setMatchAroundTime(createMatchDTO.getMatchAroundTime());
        m.setPlayers(players);
        m.setMatchOrganizer(p);
        matchRepository.save(m);
    }

    @Override
    public List<MatchDTO> getMatches(){
        return findAllMatches();
    }

    public List<MatchDTO> findAllMatches() {
        return matchRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MatchDTO convertToDTO(Match match) {
        MatchDTO dto = new MatchDTO();
        dto.setId(match.getId());
        dto.setFreePosition(match.getFreePosition());
        dto.setMatchDay(match.getMatchDay());
        dto.setMatchAroundTime(match.getMatchAroundTime());
        dto.setMatchConfirmedTime(match.getMatchConfirmedTime());
        dto.setNotes(match.getNotes());

        // Konvertuj igrače u DTO
        List<PlayerDTO> playerDTOs = match.getPlayers().stream()
                .map(player -> {
                    PlayerDTO playerDTO = new PlayerDTO();
                    playerDTO.setId(player.getId());
                    playerDTO.setPhone(playerDTO.getPhone());
                    playerDTO.setUsername(player.getUsername());
                    playerDTO.setFirstName(player.getFirstName());
                    playerDTO.setLastName(player.getLastName());
                    playerDTO.setEmail(player.getEmail());
                    playerDTO.setLevel(player.getLevel());
                    return playerDTO;
                })
                .collect(Collectors.toList());
        dto.setPlayers(playerDTOs);

        // Konvertuj organizatora
        PlayerDTO organizerDTO = new PlayerDTO();
        organizerDTO.setId(match.getMatchOrganizer().getId());
        organizerDTO.setUsername(match.getMatchOrganizer().getUsername());
        organizerDTO.setFirstName(match.getMatchOrganizer().getFirstName());
        organizerDTO.setLastName(match.getMatchOrganizer().getLastName());
        organizerDTO.setEmail(match.getMatchOrganizer().getEmail());
        organizerDTO.setPhone(match.getMatchOrganizer().getPhone());
        organizerDTO.setLevel(match.getMatchOrganizer().getLevel());
        dto.setMatchOrganizer(organizerDTO);

        dto.setLocation(match.getLocation().getName());

        if (match.getCourt() != null) {
            CourtDTO courtDTO = new CourtDTO();
            courtDTO.setId(match.getCourt().getId());
            courtDTO.setCourtName(match.getCourt().getCourtName());
            courtDTO.setPhone(match.getCourt().getPhone());
            courtDTO.setAddres(match.getCourt().getAddres());
            dto.setCourt(courtDTO);
        }

        return dto;
    }

}
