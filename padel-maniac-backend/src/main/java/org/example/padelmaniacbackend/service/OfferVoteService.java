package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTOs.OfferVoteDTO.OfferVoteDTO;
import org.example.padelmaniacbackend.DTOs.OfferVoteDTO.OfferVoteRequestDTO;

public interface OfferVoteService {

    public void vote(OfferVoteRequestDTO offerVoteRequestDTO);

}
