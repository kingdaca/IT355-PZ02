package org.example.padelmaniacbackend.service.impl;

import org.example.padelmaniacbackend.DTOs.OfferDTO.OfferDTO;
import org.example.padelmaniacbackend.DTOs.OfferDTO.CreatOfferDTO;
import org.example.padelmaniacbackend.DTOs.OfferVoteDTO.OfferVoteDTO;
import org.example.padelmaniacbackend.DTOs.playerDTO.PlayerDTO;
import org.example.padelmaniacbackend.model.*;
import org.example.padelmaniacbackend.repository.OfferRepository;
import org.example.padelmaniacbackend.repository.CourtRepository;
import org.example.padelmaniacbackend.repository.MatchRepository;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.service.OfferService;
import org.example.padelmaniacbackend.service.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OfferServiceImpl implements OfferService {

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
    @Override
    public void createOffer(CreatOfferDTO creatOfferDTO) {
        Player p = playerRepository.findById(creatOfferDTO.getUserId());
        Court c = courtRepository.findById(p.getCourt().getId());
        Match m = matchRepository.findById(creatOfferDTO.getMatchId());
        Offer offer = new Offer();
        offer.setCourt(c);
        offer.setOfferTime(creatOfferDTO.getTime());
        offer.setOfferedPrice(creatOfferDTO.getPrice());
        offer.setStatus(Offer.OfferStatus.PENDING);
        offer.setNotes(creatOfferDTO.getNotes());
        offer.setMatch(m);
        offerRepository.save(offer);
    }

    @Override
    public List<OfferDTO> findByMatchId(Long matchId) {
        Match m = matchRepository.findById(matchId);
        List<Offer> offers = offerRepository.findByMatch(m);
       return offers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

    }

    private OfferDTO convertToDTO(Offer offer){
        OfferDTO dto = new OfferDTO();
        System.out.println(offer.getVotes());
        dto.setCourt(courtService.convertToDTO((offer.getCourt())));
        dto.setOfferedPrice(offer.getOfferedPrice());
        dto.setOfferTime(offer.getOfferTime());
        dto.setNotes(offer.getNotes());
        dto.setId(offer.getId());
        dto.setStatus(offer.getStatus());
        dto.setVotes(offer.getVotes().stream().map(this::convertOfferDTO).collect(Collectors.toSet()));
        return dto;
    }

    private OfferVoteDTO convertOfferDTO(OfferVote offerVote){
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

}
