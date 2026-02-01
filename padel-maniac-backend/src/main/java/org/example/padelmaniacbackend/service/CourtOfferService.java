package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTOs.CourtOfferDTO.CourtOfferDTO;
import org.example.padelmaniacbackend.DTOs.CourtOfferDTO.CreatCourtOfferDTO;

import java.util.List;

public interface CourtOfferService {

    public void createOffer(CreatCourtOfferDTO creatCourtOfferDTO);

    public List<CourtOfferDTO> findByMatchId(Long matchId);
}
