package org.example.padelmaniacbackend.service.impl;

import org.example.padelmaniacbackend.DTOs.CourtOfferDTO.CourtOfferDTO;
import org.example.padelmaniacbackend.DTOs.CourtOfferDTO.CreatCourtOfferDTO;
import org.example.padelmaniacbackend.model.Court;
import org.example.padelmaniacbackend.model.CourtOffer;
import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.model.Player;
import org.example.padelmaniacbackend.repository.CourtOfferRepository;
import org.example.padelmaniacbackend.repository.CourtRepository;
import org.example.padelmaniacbackend.repository.MatchRepository;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.service.CourtOfferService;
import org.example.padelmaniacbackend.service.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourtOfferServiceImpl implements CourtOfferService {

    @Autowired
    private CourtOfferRepository courtOfferRepository;

    @Autowired
    private CourtRepository courtRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private CourtService courtService;
    @Override
    public void createOffer(CreatCourtOfferDTO creatCourtOfferDTO) {
        Player p = playerRepository.findById(creatCourtOfferDTO.getUserId());
        Court c = courtRepository.findById(p.getCourt().getId());
        Match m = matchRepository.findById(creatCourtOfferDTO.getMatchId());
        CourtOffer courtOffer = new CourtOffer();
        courtOffer.setCourt(c);
        courtOffer.setOfferTime(creatCourtOfferDTO.getTime());
        courtOffer.setOfferedPrice(creatCourtOfferDTO.getPrice());
        courtOffer.setStatus(CourtOffer.OfferStatus.PENDING);
        courtOffer.setNotes(creatCourtOfferDTO.getNotes());
        courtOffer.setMatch(m);
        courtOfferRepository.save(courtOffer);
    }

    @Override
    public List<CourtOfferDTO> findByMatchId(Long matchId) {
        Match m = matchRepository.findById(matchId);
        List<CourtOffer> offers = courtOfferRepository.findByMatch(m);
       return offers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

    }

    private CourtOfferDTO convertToDTO(CourtOffer courtOffer){
        CourtOfferDTO dto = new CourtOfferDTO();
        dto.setCourt(courtService.convertToDTO((courtOffer.getCourt())));
        dto.setOfferedPrice(courtOffer.getOfferedPrice());
        dto.setOfferTime(courtOffer.getOfferTime());
        dto.setNotes(courtOffer.getNotes());
        dto.setId(courtOffer.getId());
        dto.setStatus(courtOffer.getStatus());
        return dto;
    }
}
