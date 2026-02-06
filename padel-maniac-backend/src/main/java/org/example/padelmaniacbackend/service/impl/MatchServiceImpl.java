package org.example.padelmaniacbackend.service.impl;

import jakarta.transaction.Transactional;
import org.example.padelmaniacbackend.DTOs.Court.CourtDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.CreateMatchDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchUnsubscribeOrJoinDTO;
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
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
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
    private NotificationService notificationService;

    @Autowired
    private NotificationRepository notificationRepository;


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
        m.setNeedReservation(createMatchDTO.isNeedReservation());
        m.setMatchStatus(Match.MatchStatus.OPEN);
        m.setMatchOrganizer(p);
        m.setMatchDuration(createMatchDTO.getMatchDuration());
        if(m.isNeedReservation()){
            m.setMatchScheduledTime(createMatchDTO.getMatchAroundTime());
        }else{
            m.setMatchAroundTime(createMatchDTO.getMatchAroundTime());
        }
        matchRepository.save(m);
    }


    @Override
    public List<MatchDTO> getMatches(){
        return findAllMatches();
    }

    @Override
    public MatchDTO joinToMatch(MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO) {

        Match m = matchRepository.findById(matchUnsubscribeOrJoinDTO.getMatchId());
        if (m == null) {
            throw new ResourceNotFoundException("Match not found");
        }
        if (m.getFreePosition() <= 0) {
            throw new BusinessException("Match is full");
        }

        Player p = m.getPotentialPlayers().stream()
                .filter(player -> player.getId().equals(matchUnsubscribeOrJoinDTO.getPlayerId()))
                .findFirst()
                .orElse(null);

        if(p == null){
            throw new ResourceNotFoundException("User not found");
        }

        String message = "You have a new player in match at " +m.getMatchDay() + " " +m.getMatchAroundTime() ;

        notificationService.sendNotification(m.getMatchOrganizer(),message);

        for (Player player : m.getPlayers()) {
            notificationService.sendNotification(player,message);
        }

        m.getPotentialPlayers().remove(p);

        m.getPlayers().add(p);

        m.setFreePosition(m.getFreePosition() -1);

        if(m.getFreePosition() == 0){
            m.setMatchStatus(Match.MatchStatus.FULL);

            message = "Your match is full " +m.getMatchDay() + " " +m.getMatchAroundTime() ;

            m.getPotentialPlayers().clear();

            notificationService.sendNotification(m.getMatchOrganizer(),message);

            for (Player player : m.getPlayers()) {
                notificationService.sendNotification(player,message);
            }

            notificationService.sendToNearbyCourts(m.getLocation());
        }

        matchRepository.save(m);

        return convertToDTO(m);
    }

    @Override
    public MatchDTO requestForMatch(MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO) {
        Player p = playerRepository.findById(matchUnsubscribeOrJoinDTO.getPlayerId());
        Match m = matchRepository.findById(matchUnsubscribeOrJoinDTO.getMatchId());
        if(m.getFreePosition() == 0){
            throw new ResourceNotFoundException("No free position");
        }
        if (p == null) {
            throw new ResourceNotFoundException("Player not found");
        }
        if (m == null) {
            throw new ResourceNotFoundException("Match not found");
        }
       m.getPotentialPlayers().add(p);
       Match saved = matchRepository.save(m);
       if(saved.getId() == null){
           throw new BusinessException("Match not updated");
       }

       String message = "New request form match in" + m.getMatchDay() + " " + m.getMatchAroundTime();
       notificationService.sendNotification(m.getMatchOrganizer(), message);

       return convertToDTO(saved);
    }

    @Override
    public MatchDTO rejectRequest(MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO) {
        Match m = matchRepository.findById(matchUnsubscribeOrJoinDTO.getMatchId());
        Player p = m.getPotentialPlayers().stream()
                .filter(player -> player.getId().equals(matchUnsubscribeOrJoinDTO.getPlayerId()))
                .findFirst()
                .orElse(null);

        if(p == null){
            throw new ResourceNotFoundException("User not found");
        }

        m.getPotentialPlayers().remove(p);

        Match saved = matchRepository.save(m);

        if(saved == null){
            throw new ResourceNotFoundException("SQL error");
        }

        String message = "Your request for match in " + m.getMatchDay() + " " + m.getMatchAroundTime() +  "is rejected";
        notificationService.sendNotification(p, message);

        return convertToDTO(saved);
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
        dto.setNeedReservation(match.isNeedReservation());
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

        List<PlayerDTO> potentialPlayerDTOs = match.getPotentialPlayers().stream()
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
        dto.setPotentialPlayers(potentialPlayerDTOs);

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

    public List<MatchDTO> getUpcomingMatches(Long playerId){
        LocalDate lt
                = LocalDate.now();
        System.out.println(lt);
        Player p = playerRepository.findById(playerId);
        List<Match> matches = matchRepository.findUpcomingMatches(lt,p.getCourt().getCity());
        if (matches.isEmpty()) {
            throw new ResourceNotFoundException("No upcoming matches");
        }
        List<MatchDTO> matchDTOS = matches.stream().map(this::convertToDTO).collect(Collectors.toList());
    return matchDTOS;
    }

    @Override
    public MatchDTO matchUnsubscribe(MatchUnsubscribeOrJoinDTO matchUnsubscribeOrJoinDTO) {
        Match m = matchRepository.findById(matchUnsubscribeOrJoinDTO.getMatchId());
        if (m == null) {
            throw new ResourceNotFoundException("Match not found");
        }

        Player p = playerRepository.findById(matchUnsubscribeOrJoinDTO.getPlayerId());
        if (p == null) {
            throw new ResourceNotFoundException("Player not found");
        }

        boolean removed = m.getPlayers()
                .removeIf(player -> Objects.equals(player.getId(), p.getId()));

        if (!removed) {
            throw new ResourceNotFoundException("Player is not part of this match");
        }

        m.setMatchStatus(Match.MatchStatus.OPEN);

        m.setFreePosition(m.getFreePosition() + 1);

        matchRepository.save(m);

        String message = p.getFirstName() + " " + p.getLastName() + " has left the match.";

        notificationService.sendNotification(m.getMatchOrganizer(), message);

        for (Player player : m.getPlayers()) {
            if (!Objects.equals(player.getId(), m.getMatchOrganizer().getId())) {
                notificationService.sendNotification(player, message);
            }
        }

        return convertToDTO(m);

    }

}
