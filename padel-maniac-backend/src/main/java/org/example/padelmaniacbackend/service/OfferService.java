package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTOs.OfferDTO.OfferDTO;
import org.example.padelmaniacbackend.DTOs.OfferDTO.CreatOfferDTO;

import java.util.List;

public interface OfferService {

    public void createOffer(CreatOfferDTO creatOfferDTO);

    public List<OfferDTO> findByMatchId(Long matchId);
}
