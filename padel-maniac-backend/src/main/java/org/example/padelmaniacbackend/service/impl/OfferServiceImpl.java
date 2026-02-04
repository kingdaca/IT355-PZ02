package org.example.padelmaniacbackend.service.impl;

import jakarta.transaction.Transactional;
import org.example.padelmaniacbackend.DTOs.DTOConverter;
import org.example.padelmaniacbackend.DTOs.OfferDTO.OfferDTO;
import org.example.padelmaniacbackend.DTOs.OfferDTO.CreatOfferDTO;
import org.example.padelmaniacbackend.DTOs.OfferVoteDTO.OfferVoteDTO;
import org.example.padelmaniacbackend.DTOs.playerDTO.PlayerDTO;
import org.example.padelmaniacbackend.exeption.ResourceNotFoundException;
import org.example.padelmaniacbackend.model.*;
import org.example.padelmaniacbackend.repository.OfferRepository;
import org.example.padelmaniacbackend.repository.CourtRepository;
import org.example.padelmaniacbackend.repository.MatchRepository;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.service.OfferService;
import org.example.padelmaniacbackend.service.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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

    @Autowired
    private DTOConverter converter;
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

    @Override
    public Set<OfferDTO> findByCourtId(Long userId) throws Throwable {
        Player p =  playerRepository.findById(userId);
        if(p == null){
            throw new ResourceNotFoundException("Player is not find");
        }
        List<Offer> offers = offerRepository.findByCourtId(p.getCourt().getId());

        if(offers.isEmpty()){
            throw new ResourceNotFoundException("Offers is empty");
        }
        return  offers.stream().map(this::convertToDTO).collect(Collectors.toSet());
    }

    @Override
    public Boolean cancelOffer (Long offerId){
        Offer offer = offerRepository.findById(offerId);
        offerRepository.delete(offer);
        return true;
    }

    @Override
    @Transactional
    public OfferDTO confirmOffer(Long offerId) {
        Offer offer = offerRepository.findById(offerId);
        System.out.println(convertToDTO(offer));
        offer.setStatus(Offer.OfferStatus.CONFIRMED);
        offerRepository.save(offer);
        if(offer == null){
            throw new ResourceNotFoundException("Offer not find");
        }
        Match m = matchRepository.findById(offer.getMatch().getId());
        if(m == null){
            throw new ResourceNotFoundException("Offer not find");
        }
        BigDecimal floatAsBigDecimal = BigDecimal.valueOf(m.getMatchDuration());
        BigDecimal result = offer.getOfferedPrice().multiply(floatAsBigDecimal);

        m.setPrice(result);
        m.setMatchScheduledTime(offer.getOfferTime());
        m.setCourt(offer.getCourt());
        m.setMatchStatus(Match.MatchStatus.SCHEDULED);
        matchRepository.save(m);

        return convertToDTO(offer);
    }


    private OfferDTO convertToDTO(Offer offer){
        OfferDTO dto = new OfferDTO();
        dto.setCourt(courtService.convertToDTO((offer.getCourt())));
        dto.setOfferedPrice(offer.getOfferedPrice());
        dto.setOfferTime(offer.getOfferTime());
        dto.setMatch(converter.convertToMatchDTO(offer.getMatch()));
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
