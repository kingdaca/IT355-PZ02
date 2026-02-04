package org.example.padelmaniacbackend.service.impl;

import jakarta.transaction.Transactional;
import org.example.padelmaniacbackend.DTOs.DTOConverter;
import org.example.padelmaniacbackend.DTOs.OfferVoteDTO.OfferVoteRequestDTO;
import org.example.padelmaniacbackend.exeption.BusinessException;
import org.example.padelmaniacbackend.model.Match;
import org.example.padelmaniacbackend.model.Offer;
import org.example.padelmaniacbackend.model.OfferVote;
import org.example.padelmaniacbackend.model.Player;
import org.example.padelmaniacbackend.repository.OfferRepository;
import org.example.padelmaniacbackend.repository.OfferVoteRepository;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.service.OfferVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfferVoteServiceImpl implements OfferVoteService {

    @Autowired
    private OfferVoteRepository offerVoteRepository;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private DTOConverter dtoConverter;

    @Override
    @Transactional
    public void vote(OfferVoteRequestDTO offerVoteRequestDTO) {
        Offer offer = offerRepository.findById(offerVoteRequestDTO.getOfferId());
        Player p = playerRepository.findById(offerVoteRequestDTO.getPlayerId());

        if(offerVoteRepository.existsByPlayerAndMatch(p.getId(),offer.getMatch().getId())){
            throw new BusinessException("Već ste glasali za ovaj meč. Možete glasati samo jednom.");
        }

        OfferVote offerVote = new OfferVote();
        offerVote.setOffer(offer);
        offerVote.setPlayer(p);
        offerVoteRepository.save(offerVote);

        if(offer.getMatch().getPlayers().size() + 1 == offerVoteRepository.countVotes(offer.getMatch().getId())){
            offer.setStatus(Offer.OfferStatus.ACCEPTED);
            offerRepository.save(offer);

            List<Offer> offers = offerRepository.findByMatch(offer.getMatch());
            offers.forEach(offer1 -> {
                if (offer1.getId() != offer.getId()){
                    offer1.setStatus(Offer.OfferStatus.REJECTED);
                }
            });
        }

    }
}
