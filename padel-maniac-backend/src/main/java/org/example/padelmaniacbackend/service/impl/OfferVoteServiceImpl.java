package org.example.padelmaniacbackend.service.impl;

import jakarta.transaction.Transactional;
import org.example.padelmaniacbackend.DTOs.OfferVoteDTO.OfferVoteDTO;
import org.example.padelmaniacbackend.DTOs.OfferVoteDTO.OfferVoteRequestDTO;
import org.example.padelmaniacbackend.model.Offer;
import org.example.padelmaniacbackend.model.OfferVote;
import org.example.padelmaniacbackend.model.Player;
import org.example.padelmaniacbackend.repository.OfferRepository;
import org.example.padelmaniacbackend.repository.OfferVoteRepository;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.service.OfferVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OfferVoteServiceImpl implements OfferVoteService {

    @Autowired
    private OfferVoteRepository offerVoteRepository;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Override
    @Transactional
    public void vote(OfferVoteRequestDTO offerVoteRequestDTO) {
        Offer offer = offerRepository.findById(offerVoteRequestDTO.getOfferId());
        Player p = playerRepository.findById(offerVoteRequestDTO.getPlayerId());
        OfferVote offerVote = new OfferVote();
        offerVote.setOffer(offer);
        offerVote.setPlayer(p);
        offerVoteRepository.save(offerVote);
    }
}
