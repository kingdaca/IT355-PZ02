package org.example.padelmaniacbackend.service.impl;

import jakarta.transaction.Transactional;
import org.example.padelmaniacbackend.DTOs.Court.CourtDTO;
import org.example.padelmaniacbackend.DTOs.DTOConverter;
import org.example.padelmaniacbackend.DTOs.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchDTO;
import org.example.padelmaniacbackend.DTOs.playerDTO.PlayerDTO;
import org.example.padelmaniacbackend.exeption.BusinessException;
import org.example.padelmaniacbackend.exeption.ResourceNotFoundException;
import org.example.padelmaniacbackend.model.*;
import org.example.padelmaniacbackend.repository.CityRepository;
import org.example.padelmaniacbackend.repository.MatchRepository;
import org.example.padelmaniacbackend.repository.NotificationRepository;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.service.MatchService;
import org.example.padelmaniacbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import javax.swing.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
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

    @Autowired
    private NotificationRepository notificationRepository;

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private DTOConverter converter;

    public MatchServiceImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void createNewMatch(CreateMatchDTO createMatchDTO, String username) {
        Match m = new Match();
        Player p = playerRepository.findByUsername(username);
        if (p == null) {
            throw new ResourceNotFoundException("Player not found");
        }
        City city = cityRepository.findByName(createMatchDTO.getCity());
        if (city == null) {
            throw new ResourceNotFoundException("City not found");
        }
        m.setMatchDay(createMatchDTO.getDate());
        m.setLocation(city);
        m.setNotes(createMatchDTO.getNotes());
        m.setFreePosition(createMatchDTO.getNumberOfPlayers());
        m.setMatchAroundTime(createMatchDTO.getMatchAroundTime());
        m.setMatchStatus(Match.MatchStatus.OPEN);
        m.setMatchOrganizer(p);
        m.setMatchDuration(createMatchDTO.getMatchDuration());
        matchRepository.save(m);
    }


    @Override
    public List<MatchDTO> getMatches(){
        return findAllMatches();
    }

    @Override
    public MatchDTO joinToMatch(Long matchId, String username) {
        Player p = playerRepository.findByUsername(username);
        Match m = matchRepository.findById(matchId);
        if (p == null) {
            throw new ResourceNotFoundException("Player not found");
        }
        if (m == null) {
            throw new ResourceNotFoundException("Match not found");
        }
        if (m.getFreePosition() <= 0) {
            throw new BusinessException("Match is full");
        }

        m.getPlayers().add(p);

        m.setFreePosition(m.getFreePosition() -1);

        if(m.getFreePosition() == 0){
            m.setMatchStatus(Match.MatchStatus.FULL);
        }

        matchRepository.save(m);

        String message = "You have a new player in match at " +m.getMatchDay() + " " +m.getMatchAroundTime() ;

        Notification organizerNotification = new Notification();
        organizerNotification.setMessage(message);
        organizerNotification.setSentAt(LocalDateTime.now(ZoneOffset.UTC));
        organizerNotification.setPlayer(m.getMatchOrganizer());
        notificationRepository.save(organizerNotification);
        messagingTemplate.convertAndSend("/topic/notifications/"+m.getMatchOrganizer().getId(),converter.convertToNotificatioDTO(organizerNotification));


        for (Player player : m.getPlayers()) {
            Notification notification = new Notification();
            notification.setMessage(message);
            notification.setSentAt(LocalDateTime.now(ZoneOffset.UTC));
            notification.setPlayer(player);
            notificationRepository.save(notification);
            messagingTemplate.convertAndSend("/topic/notifications/"+player.getId(),converter.convertToNotificatioDTO(notification));


        }


        return convertToDTO(m);
    }

    public MatchDTO matchDetails(Long matchId){
        Match match = matchRepository.findById(matchId);
        if (match == null) {
            throw new ResourceNotFoundException("Match not found");
        }
        return convertToDTO(match);
    }

    public MatchDTO removeMatch(Long matchId){
        Match m = matchRepository.findById(matchId);
        if (m == null) {
            throw new ResourceNotFoundException("Match not found");
        }
        m.getPlayers().clear();
        matchRepository.save(m);
        matchRepository.delete(m);
        return convertToDTO(m);
    }


    public List<MatchDTO> findAllMatches() {
        return matchRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private MatchDTO convertToDTO(Match match) {
        if (match == null) {
            throw new ResourceNotFoundException("Match not found");
        }
        MatchDTO dto = new MatchDTO();
        dto.setId(match.getId());
        dto.setFreePosition(match.getFreePosition());
        dto.setMatchDay(match.getMatchDay());
        dto.setMatchAroundTime(match.getMatchAroundTime());
        dto.setMatchScheduledTime(match.getMatchScheduledTime());
        dto.setNotes(match.getNotes());
        dto.setMatchDuration(match.getMatchDuration());

        List<PlayerDTO> playerDTOs = match.getPlayers().stream()
                .map(player -> {
                    PlayerDTO playerDTO = new PlayerDTO();
                    playerDTO.setId(player.getId());
                    playerDTO.setPhone(player.getPhone());
                    playerDTO.setUsername(player.getUsername());
                    playerDTO.setFirstName(player.getFirstName());
                    playerDTO.setLastName(player.getLastName());
                    playerDTO.setEmail(player.getEmail());
                    playerDTO.setLevel(player.getLevel());
                    return playerDTO;
                })
                .collect(Collectors.toList());
        dto.setPlayers(playerDTOs);

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

        dto.setMatchStatus(match.getMatchStatus());

        if (match.getCourt() != null) {
            CourtDTO courtDTO = new CourtDTO();
            courtDTO.setId(match.getCourt().getId());
            courtDTO.setCourtName(match.getCourt().getCourtName());
            courtDTO.setPhone(match.getCourt().getPhone());
            courtDTO.setCity(match.getCourt().getCity().getName());
            courtDTO.setAddress(match.getCourt().getAddress());
            dto.setCourt(courtDTO);
        }

        return dto;
    }

    public List<MatchDTO> getUpcomingMatches(){
        LocalDate lt
                = LocalDate.now();
        List<Match> matches = matchRepository.findUpcomingMatches(lt);
        if (matches.isEmpty()) {
            throw new ResourceNotFoundException("No upcoming matches");
        }
        List<MatchDTO> matchDTOS = matches.stream().map(this::convertToDTO).collect(Collectors.toList());
    return matchDTOS;
    }

}
