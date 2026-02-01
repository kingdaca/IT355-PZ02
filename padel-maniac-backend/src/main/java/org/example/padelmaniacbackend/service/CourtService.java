package org.example.padelmaniacbackend.service;

import org.example.padelmaniacbackend.DTO.Court.CourtDTO;
import org.example.padelmaniacbackend.model.Court;

import java.util.List;

public interface CourtService {

    public List<CourtDTO> getAllCourts();
}
