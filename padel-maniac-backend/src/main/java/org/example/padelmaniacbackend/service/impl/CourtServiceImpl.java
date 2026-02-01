package org.example.padelmaniacbackend.service.impl;

import org.example.padelmaniacbackend.DTO.Court.CourtDTO;
import org.example.padelmaniacbackend.DTO.matchDTO.MatchDTO;
import org.example.padelmaniacbackend.model.Court;
import org.example.padelmaniacbackend.repository.CourtRepository;
import org.example.padelmaniacbackend.service.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourtServiceImpl implements CourtService {

    @Autowired
    private CourtRepository courtRepository;
    @Override
    public List<CourtDTO> getAllCourts() {
        return findAllCourts();
    }

    public List<CourtDTO> findAllCourts() {
        return courtRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CourtDTO convertToDTO(Court court){
        CourtDTO courtDTO = new CourtDTO();
        courtDTO.setAddress(court.getAddress());
        courtDTO.setId(court.getId());
        courtDTO.setCity(court.getCity().getName());
        courtDTO.setCourtName(court.getCourtName());
        courtDTO.setPhone(court.getPhone());
        return courtDTO;
    }
}
