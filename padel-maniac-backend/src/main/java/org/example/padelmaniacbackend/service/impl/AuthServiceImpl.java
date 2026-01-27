package org.example.padelmaniacbackend.service.impl;

import org.example.padelmaniacbackend.DTO.registration.RegistrationDTO;
import org.example.padelmaniacbackend.model.Player;
import org.example.padelmaniacbackend.model.Role;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.repository.RoleRepository;
import org.example.padelmaniacbackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Player login(String username) {
        return playerRepository.findByUsername(username);
    }

    @Override
    public Player registration(RegistrationDTO registrationDTO) {
        Player p = new Player();

        p.setUsername(registrationDTO.getUsername());
        p.setPassword(registrationDTO.getPassword());
        p.setEmail(registrationDTO.getEmail());
        p.setFirstName(registrationDTO.getFirstname());
        p.setLastName(registrationDTO.getLastName());
        p.setPhone(registrationDTO.getPhone());
        p.setLevel(Player.Level.BEGINNER);
        p.setRole(roleRepository.findByName(Role.RoleName.PLAYER));

       return playerRepository.save(p);
    }
}
