package org.example.padelmaniacbackend.service.impl;

import org.example.padelmaniacbackend.DTOs.registration.RegistrationDTO;
import org.example.padelmaniacbackend.exeption.ResourceNotFoundException;
import org.example.padelmaniacbackend.model.Player;
import org.example.padelmaniacbackend.model.Role;
import org.example.padelmaniacbackend.repository.PlayerRepository;
import org.example.padelmaniacbackend.repository.RoleRepository;
import org.example.padelmaniacbackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private RoleRepository roleRepository;


    @Override
    public Player login(String username) {
        Player player = playerRepository.findByUsername(username);
        if (player == null) {
            throw new ResourceNotFoundException("Player not found");
        }
        return player;
    }

    @Override
    public Player registration(RegistrationDTO registrationDTO) {
        Player p = new Player();
        Role role = roleRepository.findByName(Role.RoleName.PLAYER);
        if (role == null) {
            throw new ResourceNotFoundException("Role not found");
        }

        p.setUsername(registrationDTO.getUsername());
        p.setPassword(registrationDTO.getPassword());
        p.setEmail(registrationDTO.getEmail());
        p.setFirstName(registrationDTO.getFirstname());
        p.setLastName(registrationDTO.getLastName());
        p.setPhone(registrationDTO.getPhone());
        p.setLevel(Player.Level.BEGINNER);
        p.setRole(role);

       return playerRepository.save(p);
    }
}
