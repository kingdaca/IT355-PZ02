package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTOs.OfferDTO.OfferDTO;
import org.example.padelmaniacbackend.DTOs.OfferDTO.CreatOfferDTO;

import java.util.List;
import java.util.Set;

public interface OfferService {

    public void createOffer(CreatOfferDTO creatOfferDTO);

    public List<OfferDTO> findByMatchId(Long matchId);

    public Set<OfferDTO> findByCourtId(Long playerId) throws Throwable;

    public Boolean cancelOffer (Long offerId);

    public OfferDTO confirmOffer(Long offerId);
}
