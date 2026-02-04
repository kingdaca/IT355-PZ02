package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTOs.Court.CourtDTO;
import org.example.padelmaniacbackend.DTOs.registration.CourtOwnerRegistrationDTO;
import org.example.padelmaniacbackend.model.Court;

import java.util.List;

public interface CourtService {

    public List<CourtDTO> getAllCourts();

    public CourtDTO convertToDTO(Court court);

    public Boolean registerCourt(CourtOwnerRegistrationDTO courtOwnerRegistrationDTO);

    public CourtDTO getCourtInfoByPlayerId(Long playerId);
}
