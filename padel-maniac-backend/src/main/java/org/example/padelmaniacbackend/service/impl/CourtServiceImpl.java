package org.example.padelmaniacbackend.service.impl;

import jakarta.transaction.Transactional;
import org.example.padelmaniacbackend.DTOs.Court.CourtDTO;
import org.example.padelmaniacbackend.DTOs.registration.CourtOwnerRegistrationDTO;
import org.example.padelmaniacbackend.model.Court;
import org.example.padelmaniacbackend.model.Player;
import org.example.padelmaniacbackend.model.Role;
import org.example.padelmaniacbackend.repository.CityRepository;
import org.example.padelmaniacbackend.repository.CourtRepository;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.repository.RoleRepository;
import org.example.padelmaniacbackend.service.CourtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourtServiceImpl implements CourtService {

    @Autowired
    private CourtRepository courtRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public List<CourtDTO> getAllCourts() {
        return findAllCourts();
    }

    public List<CourtDTO> findAllCourts() {
        return courtRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    @Override
    public CourtDTO convertToDTO(Court court){
        CourtDTO courtDTO = new CourtDTO();
        courtDTO.setAddress(court.getAddress());
        courtDTO.setId(court.getId());
        courtDTO.setCity(court.getCity().getName());
        courtDTO.setCourtName(court.getCourtName());
        courtDTO.setPhone(court.getPhone());
        return courtDTO;
    }

    @Override
    @Transactional
    public Boolean registerCourt(CourtOwnerRegistrationDTO courtOwnerRegistrationDTO) {
        try{
            Player p = new Player();
            Court c = new Court();
            p.setUsername(courtOwnerRegistrationDTO.getUsername());
            p.setPassword(passwordEncoder.encode(courtOwnerRegistrationDTO.getPassword()));
            p.setEmail(courtOwnerRegistrationDTO.getEmail());
            p.setFirstName(courtOwnerRegistrationDTO.getFirstName());
            p.setLastName(courtOwnerRegistrationDTO.getLastName());
            p.setPhone(courtOwnerRegistrationDTO.getPhone());
            p.setRole(roleRepository.findByName(Role.RoleName.COURT_OWNER));

            c.setCourtName(courtOwnerRegistrationDTO.getCourtName());
            c.setPhone(courtOwnerRegistrationDTO.getCourtPhone());
            c.setAddress(courtOwnerRegistrationDTO.getAddress());
            c.setCity(cityRepository.findById(courtOwnerRegistrationDTO.getCityId()));
            courtRepository.save(c);
            p.setCourt(c);
            playerRepository.save(p);
            return true;
        }catch (Exception ex){
            return false;
        }
    }
}
