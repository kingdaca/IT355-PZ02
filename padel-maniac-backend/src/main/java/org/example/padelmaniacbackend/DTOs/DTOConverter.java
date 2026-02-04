package org.example.padelmaniacbackend.DTOs;

import org.example.padelmaniacbackend.DTOs.Court.CourtDTO;
import org.example.padelmaniacbackend.DTOs.NotificatioDTO.NotificationDTO;
import org.example.padelmaniacbackend.DTOs.OfferDTO.OfferDTO;
import org.example.padelmaniacbackend.DTOs.OfferVoteDTO.OfferVoteDTO;
import org.example.padelmaniacbackend.DTOs.matchDTO.MatchDTO;
import org.example.padelmaniacbackend.DTOs.playerDTO.PlayerDTO;
import org.example.padelmaniacbackend.model.*;
import org.example.padelmaniacbackend.repository.CourtRepository;
import org.example.padelmaniacbackend.repository.MatchRepository;
import org.example.padelmaniacbackend.repository.OfferRepository;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.service.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DTOConverter {

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private CourtRepository courtRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private CourtService courtService;

    public OfferDTO convertToDTO(Offer offer){
        OfferDTO dto = new OfferDTO();
        dto.setCourt(courtService.convertToDTO((offer.getCourt())));
        dto.setOfferedPrice(offer.getOfferedPrice());
        dto.setOfferTime(offer.getOfferTime());
        dto.setNotes(offer.getNotes());
        dto.setId(offer.getId());
        dto.setStatus(offer.getStatus());
        dto.setVotes(offer.getVotes().stream().map(this::convertOffeVoterDTO).collect(Collectors.toSet()));
        return dto;
    }

    public OfferVoteDTO convertOffeVoterDTO(OfferVote offerVote){
        OfferVoteDTO offerVoteDTO = new OfferVoteDTO();
        offerVoteDTO.setPlayer(covnertToPLayerDTO(offerVote.getPlayer()));
        return offerVoteDTO;
    }

    public PlayerDTO covnertToPLayerDTO(Player p) {
        PlayerDTO dto = new PlayerDTO();
        dto.setId(p.getId());
        dto.setUsername(p.getUsername());
        dto.setEmail(p.getEmail());
        dto.setFirstName(p.getFirstName());
        dto.setLastName(p.getLastName());
        dto.setPhone(p.getPhone());
        dto.setLevel(p.getLevel());

        return dto;
    }

    public OfferVoteDTO convertToOfferVoteDTO(OfferVote offerVote){
        PlayerDTO playerDTO = covnertToPLayerDTO(offerVote.getPlayer());
        OfferDTO offerDTO = convertToDTO(offerVote.getOffer());
        return new OfferVoteDTO(offerDTO,playerDTO);
    }

    public MatchDTO convertToMatchDTO(Match match) {
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

    public NotificationDTO convertToNotificatioDTO(Notification notification){
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setId(notification.getId());
        notificationDTO.setRead(notification.isRead());
        notificationDTO.setMessage(notification.getMessage());
        notificationDTO.setPlayerId(notification.getPlayer().getId());
        return notificationDTO;
    }
}
